import React, { createContext, useContext, useEffect, useState } from 'react';

interface RouterContextType {
  path: string;
  navigate: (newPath: string, replace?: boolean) => void;
  query: Record<string, string>;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  query: {},
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [query, setQuery] = useState<Record<string, string>>(() => {
    const params = new URLSearchParams(window.location.search);
    const obj: Record<string, string> = {};
    params.forEach((v, k) => {
      obj[k] = v;
    });
    return obj;
  });

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
      const params = new URLSearchParams(window.location.search);
      const obj: Record<string, string> = {};
      params.forEach((v, k) => {
        obj[k] = v;
      });
      setQuery(obj);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newPath: string, replace = false) => {
    if (newPath === path) return;

    if (replace) {
      window.history.replaceState({}, '', newPath);
    } else {
      window.history.pushState({}, '', newPath);
    }

    const [cleanPath, search] = newPath.split('?');
    setPath(cleanPath || '/');

    const params = new URLSearchParams(search || '');
    const obj: Record<string, string> = {};
    params.forEach((v, k) => {
      obj[k] = v;
    });
    setQuery(obj);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ path, navigate, query }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Link: React.FC<{
  to: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
  onClick?: () => void;
  title?: string;
}> = ({ to, className, children, id, onClick, title }) => {
  const { navigate } = useRouter();

  return (
    <a
      id={id}
      href={to}
      title={title}
      className={className}
      onClick={(e) => {
        if (!to.startsWith('http') && !to.startsWith('#') && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          navigate(to);
          onClick?.();
        }
      }}
    >
      {children}
    </a>
  );
};
