import { entry, steps } from './builders';

export const accountEntries = [
  entry({
    id: 'account-create', category: 'account', title: 'Create an account', priority: 9,
    keywords: ['create account', 'sign up', 'signup', 'register', 'new account', 'make an account', 'join redora'],
    answer: steps('You can create a free Redora account in about a minute.', [
      'Open the Redora sign-up page and choose “Create account”.',
      'Enter your name, email address and a strong password.',
      'Open the verification email and select “Verify email”.',
      'Create your first workspace and you’re ready to go.',
    ], 'Every new account starts on the Free plan.'),
    relatedTopics: ['account-sign-in', 'plan-free', 'account-enable-2fa'],
  }),
  entry({
    id: 'account-sign-in', category: 'account', title: 'Sign in', priority: 8,
    keywords: ['sign in', 'log in', 'login', 'how to login', 'access my account'],
    answer: steps('Sign in from the Redora sign-in screen.', [
      'Enter the email address you registered with.',
      'Enter your password.',
      'If two-factor authentication is on, enter the code from your authenticator app.',
    ], 'If sign-in fails, I can walk you through fixing it.'),
    relatedTopics: ['trouble-login-failed', 'account-reset-password', 'account-enable-2fa'],
  }),
  entry({
    id: 'account-change-email', category: 'account', title: 'Change your email', priority: 8,
    keywords: ['change email', 'update email', 'new email address', 'change my email', 'edit email'],
    answer: steps('You can change the email on your account from Settings.', [
      'Go to Settings → Account.',
      'Select “Change email” and enter the new address.',
      'Confirm with your current password (on the Redora page only).',
      'Open the verification message sent to the new address and confirm.',
    ], 'Your old email keeps working until the new one is verified.'),
    relatedTopics: ['account-change-password', 'trouble-verification-email'],
  }),
  entry({
    id: 'account-reset-password', category: 'account', title: 'Reset your password', priority: 10,
    keywords: ['reset password', 'forgot password', 'password reset', 'forgot my password', 'reset my password', 'lost password'],
    answer: steps('You can reset your Redora password from the sign-in screen.', [
      'Select “Forgot password”.',
      'Enter your Redora email.',
      'Open the password-reset email.',
      'Create a new password.',
      'Sign in again.',
    ], 'If the reset email does not arrive, check spam/junk and verify that you entered the correct email address.'),
    relatedTopics: ['trouble-forgot-password', 'account-enable-2fa', 'security-overview'],
  }),
  entry({
    id: 'account-change-password', category: 'account', title: 'Change your password', priority: 8,
    keywords: ['change password', 'update password', 'new password', 'change my password'],
    answer: steps('If you are already signed in, you can change your password in Settings.', [
      'Go to Settings → Security.',
      'Select “Change password”.',
      'Enter your current password, then your new one twice.',
      'Save. Other devices may be signed out.',
    ], 'Important: use a unique password and never share it in chat.'),
    relatedTopics: ['account-reset-password', 'account-enable-2fa', 'security-compromised'],
  }),
  entry({
    id: 'account-enable-2fa', category: 'account', title: 'Enable two-factor authentication', priority: 9,
    keywords: ['2fa', 'two factor', 'two factor authentication', 'enable 2fa', 'authenticator app', 'mfa', 'turn on 2fa'],
    answer: steps('Two-factor authentication (2FA) adds a second check when you sign in.', [
      'Go to Settings → Security → Two-factor authentication.',
      'Select “Enable” and scan the QR code with an authenticator app.',
      'Enter the 6-digit code shown in the app to confirm.',
      'Save your recovery codes somewhere safe.',
    ], 'Important: never send recovery codes or one-time codes to anyone, including support or this chat.'),
    relatedTopics: ['security-overview', 'security-compromised', 'account-reset-password'],
  }),
  entry({
    id: 'account-delete', category: 'account', title: 'Delete your account', priority: 7,
    keywords: ['delete account', 'close account', 'remove my account', 'deactivate account', 'delete my account'],
    answer: steps('You can delete your account from Settings.', [
      'Go to Settings → Account → Delete account.',
      'Export anything you want to keep first (workspaces, documents, files).',
      'Cancel any active subscription so it does not renew.',
      'Confirm deletion with your password.',
    ], 'Important: deletion is permanent. Ownership of shared workspaces must be transferred first.'),
    relatedTopics: ['billing-cancel', 'team-leave-workspace'],
  }),
  entry({
    id: 'team-invite-members', category: 'account', title: 'Invite team members', priority: 8,
    keywords: ['invite', 'invite team', 'add team member', 'add member', 'invite people', 'invite teammate', 'add a user'],
    answer: steps('Workspace owners and admins can invite people.', [
      'Open your workspace and go to Settings → Members.',
      'Select “Invite”, enter one or more email addresses and choose a role.',
      'Send the invitation. Invitees get an email link.',
    ], 'Member limits depend on your plan: Free 3, Starter 10, Pro 25, Business 100.'),
    relatedTopics: ['team-change-role', 'trouble-invitation-failed', 'plans-compare'],
  }),
  entry({
    id: 'team-change-role', category: 'account', title: 'Change a workspace role', priority: 7,
    keywords: ['change role', 'workspace role', 'make admin', 'permissions', 'member role', 'change permissions'],
    answer: steps('Owners and admins can change roles.', [
      'Open Settings → Members in the workspace.',
      'Find the person and open the role menu.',
      'Choose a new role and confirm.',
    ], 'Advanced permissions (custom roles) are available on the Business plan.'),
    relatedTopics: ['team-invite-members', 'plan-business'],
  }),
  entry({
    id: 'team-leave-workspace', category: 'account', title: 'Leave a workspace', priority: 7,
    keywords: ['leave workspace', 'leave a workspace', 'remove myself', 'exit workspace', 'leave team'],
    answer: steps('You can leave any workspace you do not own.', [
      'Open the workspace and go to Settings → Members.',
      'Select your name and choose “Leave workspace”.',
      'Confirm.',
    ], 'Important: owners must transfer ownership before leaving.'),
    relatedTopics: ['team-change-role', 'account-delete'],
  }),
] as const;
