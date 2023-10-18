if (typeof importScripts === "function") {
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js"
  );

  workbox.setConfig({ debug: true });

  const subDirectory = "/workbox_portfolio";

  const router = (route, method, responseOptions) => {
    workbox.routing.registerRoute(
      new RegExp(`${subDirectory}${route}`),
      ({ event }) => {
        return new Response(responseOptions.text, {
          headers: responseOptions.headers || {},
        });
      },
      method
    );
  };

  router("/$", "GET", {
    text: "hello, world",
  });

  router("/bye", "GET", {
    text: `
      <div>
        <div>child</div>
        parent
      </div>
    `,
    headers: { "Content-Type": "text/html" },
  });
}
