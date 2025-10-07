import { useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

interface UseUnsavedChangesProps {
  hasUnsavedChanges: boolean;
  onNavigateAway?: () => Promise<boolean>;
  message?: string;
}

export const useUnsavedChanges = ({
  hasUnsavedChanges,
  onNavigateAway,
  message = "Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?",
}: UseUnsavedChangesProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isNavigating = useRef(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isNavigating.current) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);

  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      if (!hasUnsavedChanges || isNavigating.current) return;

      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href) {
        const url = new URL(link.href);
        const targetPath = url.pathname;

        if (targetPath !== pathname) {
          e.preventDefault();
          e.stopPropagation();

          if (onNavigateAway) {
            const shouldNavigate = await onNavigateAway();
            if (shouldNavigate) {
              isNavigating.current = true;
              router.push(targetPath);
            }
          }
        }
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [hasUnsavedChanges, onNavigateAway, pathname, router]);

  const handleNavigation = useCallback(
    async (path: string) => {
      if (hasUnsavedChanges && onNavigateAway) {
        const shouldNavigate = await onNavigateAway();
        if (shouldNavigate) {
          isNavigating.current = true;
          router.push(path);
        }
      } else {
        router.push(path);
      }
    },
    [hasUnsavedChanges, onNavigateAway, router]
  );

  return { handleNavigation };
};
