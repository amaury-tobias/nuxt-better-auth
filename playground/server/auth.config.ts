import { passkey } from '@better-auth/passkey'
import { admin, multiSession, twoFactor } from 'better-auth/plugins'
import { defineServerAuth } from '../../src/runtime/config'

export default defineServerAuth(() => ({
  appName: 'Nuxt Better Auth Playground',
  plugins: [
    admin(),
    passkey(),
    multiSession(),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          console.log('\n=== 2FA OTP ===')
          console.log('To:', user.email)
          console.log('OTP:', otp)
          console.log('===============\n')
        },
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log('\n=== PASSWORD RESET ===')
      console.log('To:', user.email)
      console.log('URL:', url)
      console.log('======================\n')
    },
  },
}))
