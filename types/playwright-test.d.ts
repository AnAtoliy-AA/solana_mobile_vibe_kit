declare module '@playwright/test' {
  export type Page = {
    goto: (url: string) => Promise<void>;
    route: (
      url: string | RegExp,
      handler: (route: Route, request: Request) => Promise<void>
    ) => Promise<void>;
    unroute: (url: string | RegExp) => Promise<void>;
    getByText: (text: string | RegExp) => Locator;
    getByLabel: (text: string | RegExp) => Locator;
    getByRole: (...args: unknown[]) => Locator;
  };

  export type Locator = {
    click: () => Promise<void>;
    toBeVisible: () => Promise<void>;
    toHaveText: (value: string | RegExp) => Promise<void>;
  };

  export type Route = {
    fulfill: (options: { status: number; contentType: string; body: string }) => Promise<void>;
  };

  export type Request = {
    postData: () => string | null;
  };

  export const test: {
    beforeEach: (handler: (args: { page: Page }) => Promise<void> | void) => Promise<void> | void;
  } & ((name: string, handler: (args: { page: Page }) => Promise<void> | void) => void);

  export const expect: {
    (locator: Locator): {
      toBeVisible: () => Promise<void>;
      toHaveText: (value: string | RegExp) => Promise<void>;
    };
  };
}
