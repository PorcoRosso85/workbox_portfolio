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
    text: ` <div hx-ext="debug">
    <script src="https://unpkg.com/htmx.org@1.9.6"></script>
    <button hx-get="/workbox_portfolio/hello" hx-target="#target" hx-swap="innerHTML">hx /hello</button><br />
    <div id="target"></div>
    </div> `,
    headers: { "Content-Type": "text/html" },
  });

  router("/hello", "GET", {
    text: "<div>hello, world</div>",
    headers: { "Content-Type": "text/html" },
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
