import React, { use } from "react";
import * as Form from "./ui/Form";

export function withCachedServerActionResults<
  T extends (...args: any[]) => Promise<any>
>(action: T, funcName: string, maxDuration: number) {
  const cacheKeyPart = encodeURIComponent(`cache_${funcName}_`);

  const func = (
    ...args: Parameters<T>
  ): Awaited<ReturnType<T>> | Promise<Awaited<ReturnType<T>>> => {
    // const start = Date.now();
    const cacheKey = cacheKeyPart + encodeURIComponent(JSON.stringify(args));

    const existing = localStorage.getItem(cacheKey);
    if (typeof existing === "string") {
      try {
        const cacheEntry = JSON.parse(existing);
        if (cacheEntry && Date.now() - cacheEntry.timestamp < maxDuration) {
          //   console.log("cache hit", cacheKey, Date.now() - start);
          return cacheEntry.result;
        }
      } catch {}
    }

    // console.log("cache miss", cacheKey, Date.now() - start);

    return new Promise(async (resolve, reject) => {
      action(...args)
        .then((result) => {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ result, timestamp: Date.now() })
          );

          //   console.log("cache set", cacheKey, Date.now() - start);
          resolve(result);
        })
        .catch(reject);
    });
  };

  func.purge = () => {
    const keys =
      process.env.EXPO_OS === "web"
        ? Object.keys(localStorage)
        : localStorage.keys();
    // console.log("purging cache for", funcName, keys);

    for (const key of keys) {
      if (key.startsWith(`cache_${funcName}_`)) {
        localStorage.removeItem(key);
      }
    }
  };

  func.force = (
    ...args: Parameters<T>
  ): RevalidatingPromise<Awaited<ReturnType<T>>> => {
    const results = func(...args);

    // Only returns a promise if no cache hit.
    if (results instanceof Promise) {
      return results;
    }

    const cacheKey = encodeURIComponent(
      `cache_${funcName}_${JSON.stringify(args)}`
    );
    localStorage.removeItem(cacheKey);

    const nextData = func(...args);
    return storePreviousData(nextData, results);
  };

  return func;
}

type RevalidatingPromise<T> = Promise<T> & {
  previous?: T;
};

function storePreviousData<T>(
  promise: Promise<T>,
  data: T
): RevalidatingPromise<T> {
  (promise as any).previous = data;
  return promise as RevalidatingPromise<T>;
}

type AwaitedRecord<T> = {
  [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K];
};

type UseableComponentProps<T extends Record<string, any>> = {
  UI: React.FC<AwaitedRecord<T>>;
} & T;

export function UseableComponent<T extends Record<string, any>>({
  UI,
  ...props
}: UseableComponentProps<T>) {
  const resolved = Object.entries(props).reduce((acc, [key, value]) => {
    // Use "as keyof T" to ensure key is properly typed
    if (value instanceof Promise) {
      acc[key as keyof T] = use(value);
    } else {
      acc[key as keyof T] = value;
    }

    return acc;
  }, {} as AwaitedRecord<T>);

  return <UI {...resolved} />;
}
/**
 * Alternative to `const value = useMemo(() => callAction(), []);` where the callback is invoked and a promise is returned.
 * Here the callback is invoked immediately and the result is memoized.
 * A pull to refresh is registered to re-fetch the data with a force flag.
 * Unlike the initial value, the pull to refresh will wait for the promise to resolve before updating the state.
 *
 * ```ts
 * const [externalGroup] = usePullRefreshAction((force) =>
 *   (force ? ensureExternalGroupAsync.force : ensureExternalGroupAsync)(app.id, build?.build?.id)
 * );
 * ```
 * @param cb function that returns a value. Accepts a force boolean to re-fetch the data.
 * @returns
 */
export function usePullRefreshAction<T>(
  cb: (force: boolean) => T | Promise<T>
) {
  const [data, setData] = React.useState<T | Promise<T>>(() => cb(false));
  const update = async (force: boolean = true) => {
    const promise = cb(force);
    if (promise instanceof Promise) {
      const results = await promise;
      setData(results);
    } else {
      setData(promise);
    }
    return promise;
  };

  Form.usePullRefresh(async () => {
    await update(true);
  });
  return [data, setData, update] as const;
}

export function usePullRefreshCachedAction<
  T extends (...args: any[]) => Promise<any>
>(
  callback: (callback: T) => ReturnType<T>,

  props: { action: T; name: string; timeout: number }
) {
  const cachedAction = withCachedServerActionResults(
    props.action,
    props.name,
    props.timeout
  );

  return usePullRefreshAction((force) => {
    // @ts-expect-error
    return callback(force ? cachedAction.force : cachedAction);
  });
}
