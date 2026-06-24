import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ForgotPasswordRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/sign-in'); }, []);
  return null;
}
