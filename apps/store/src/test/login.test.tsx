import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionProvider } from 'next-auth/react';
import LoginPage from '../app/(auth)/login/page';

// Mock Next.js router
const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock NextAuth
const mockSignIn = vi.fn();
vi.mock('next-auth/react', async () => {
  const actual = await vi.importActual('next-auth/react');
  return {
    ...actual,
    signIn: mockSignIn,
    useSession: () => ({
      data: null,
      status: 'unauthenticated',
    }),
  };
});

describe('Login Form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginPage = () => {
    return render(
      <SessionProvider session={null}>
        <LoginPage />
      </SessionProvider>
    );
  };

  it('should render login form and never disappear', () => {
    renderLoginPage();
    
    // Form should always be visible
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should show validation errors for invalid input', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    
    // Submit without filling form
    await user.click(submitButton);
    
    // Form should remain visible
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should show error for invalid credentials', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ error: 'Invalid credentials' });
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    
    // Fill form with invalid credentials
    await user.type(emailInput, 'invalid@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    // Form should remain visible
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100)));
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    
    // Fill form
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Should show loading state
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled();
    
    // Form should remain visible during loading
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ ok: true });
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    
    // Fill form
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText('Sign in successful! Redirecting...')).toBeInTheDocument();
    });
    
    // Form should remain visible until redirect
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });

  it('should handle unexpected errors gracefully', async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValueOnce(new Error('Network error'));
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    
    // Fill form
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Should show generic error message
    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });
    
    // Form should remain visible
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button
    
    // Password should be hidden by default
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click to show password
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click to hide password again
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should maintain form state during errors', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ error: 'Invalid credentials' });
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    
    // Fill form
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Wait for error
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    
    // Form values should be preserved
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    
    // Form should still be visible and functional
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });
});
