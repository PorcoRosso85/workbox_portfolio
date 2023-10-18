if (typeof importScripts === "function") {
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js"
  );

  workbox.setConfig({ debug: true });

  const router = (route, method, responseOptions) => {
    workbox.routing.registerRoute(
      new RegExp(route),
      ({ event }) => {
        return new Response(responseOptions.text, {
          headers: responseOptions.headers || {},
        });
      },
      method
    );
  };

  // 使用例
  router("/workbox_portfolio/bye", "GET", {
    text: `
        <div>
          <div>child</div>
          parent
        </div>
      `,
    headers: { "Content-Type": "text/html" },
  });

  router("/workbox_portfolio/$", "GET", {
    text: "hello, world",
  });

  // workbox.routing.registerRoute(
  //   new RegExp("/$"),
  //   ({ event }) => {
  //     return new Response("Hello, world!");
  //   },
  //   "GET"
  // );

  workbox.routing.registerRoute(
    new RegExp("/workbox_portfolio/hello"),
    ({ event }) => {
      return new Response(
        `
          <div>
            <div>child</div>
            parent
          </div>
        `,
        { headers: { "Content-Type": "text/html" } }
      );
    },
    "GET"
  );
}
