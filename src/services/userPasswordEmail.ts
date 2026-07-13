interface SendPasswordEmailParams {
  labId: number;
  username: string;
  email: string;
  password: string;
}

/** Demo: simulates sending a generated password email. Replace with API when available. */
export function sendGeneratedPasswordEmail(
  params: SendPasswordEmailParams,
): Promise<{ success: boolean }> {
  const { email, username } = params;
  if (!email.trim()) {
    return Promise.resolve({ success: false });
  }

  return new Promise((resolve) => {
    window.setTimeout(() => {
      console.info(`[demo] Password email sent to ${email} for user ${username}`);
      resolve({ success: true });
    }, 1200);
  });
}
