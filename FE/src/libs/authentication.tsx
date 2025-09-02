import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setIsLoading } from '@/store/general/GeneralSlice';

function withAuthorization<T extends object>(
  WrappedComponent: ComponentType<T>,
  requiredCode: string
) {
  const WithAuthWrapper = (props: T) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const menuData: any | null = useSelector(
      (state: any) => state.menu.menuData
    );
    const token = localStorage.getItem("AccessToken");

    const listOperation = menuData
      ? menuData.flatMap((menu: any) =>
          menu.listMenu
            .filter((item: any) => item.isAccess === true)
            .map((item: any) => item.code)
        )
      : [];

    useEffect(() => {
      dispatch(setIsLoading(true));
      const timer = setTimeout(() => {
        dispatch(setIsLoading(false));
      }, 1500);

      return () => clearTimeout(timer);
    }, [dispatch]);

    useEffect(() => {
      if(!token) {
        router.push('/auth/login');
        return;
      }
      if (
        requiredCode !== '' &&
        (!listOperation || !listOperation.includes(requiredCode))
      ) {
        router.push('/unauthorized');
      }
    }, [requiredCode, listOperation, router]);

    if (requiredCode !== '' && (!listOperation || !listOperation.includes(requiredCode))) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthWrapper.displayName = `WithAuthorizationAndLoading(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthWrapper;
}

export default withAuthorization;