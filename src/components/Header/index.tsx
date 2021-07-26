import { ReactElement } from 'react';
import { useRouter } from 'next/dist/client/router';
import styles from './header.module.scss';

export default function Header(): ReactElement {
  const router = useRouter();

  function handleClick(): void {
    router.push('/');
  }

  return (
    <div className={styles.heading}>
      <button type="button">
        <img src="/images/Logo.svg" alt="logo" onClick={handleClick} />
      </button>
    </div>
  );
}
