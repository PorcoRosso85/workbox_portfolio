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
    text: /*html*/ ` <div hx-ext="debug">
    <script src="https://unpkg.com/htmx.org@1.9.6"></script>
    <button hx-get="${subDirectory}/hello" hx-target="#target" hx-swap="innerHTML">hx /hello</button><br />
    <div id="target"></div>
    <form hx-post="${subDirectory}/api/form" hx-target="#submit" hx-swap="innerHTML">
      <input id="input-form" name="user_input" hx-post="/validate" hx-trigger="change">
      <button id="submit">submit</button>
    </form>
    </div> `,
    headers: { "Content-Type": "text/html" },
  });

  router("/hello", "GET", {
    text: /*html*/ `<div>hello, world</div>`,
    headers: { "Content-Type": "text/html" },
  });

  router("/page/graph", "GET", {
    text: /*html*/ `
      <div>
      <ul id="1000" class="child">
        <li class="dir" id="1001">
          Item 1
          <ul class="child">
            <li class="file" id="1002">
              Item 1.1
              <ul class="child file"></ul>
            </li>
            <li class="func" id="1003">
              Item 1.1.1
              <ul class="child"></ul>
            </li>
            <li class="func" id="1004">
              Item 1.1.2
              <ul class="child"></ul>
            </li>
            <li class="func" id="1005">
              Item 1.1.3
              <ul class="child"></ul>
            </li>
          </ul>
          <li class="dir" id="1006">
            Item 2.1
            <ul class="child"></ul>
            <li class="dir" id="1007">
              Item 2.3
              <ul class="child"></ul>
            </li>
            <li class="dir" id="1008">
              Item 2.4
              <ul class="child"></ul>
            </li>
          </li>
        </li>
      </ul>

      <style>
        .child {
          min-width: 30%;
        }
        .dir {
          padding: 10px;
          background-color: #fff9ff;
        }
        .file {
          display: flex;
          flex: none;
          padding: 10px;
          background-color: #e6f0ff;
        }
        .func {
          padding: 10px;
          background-color: #e6ffe6;
        }
        .highlight {
          border: 2px dashed #0082fc;
          background-color: #e0f7fa;
        }
        .dir:hover,
        .file:hover {
          background-color: #d9edf7;
        }
        .line {
          position: absolute;
          width: 1px;
          background-color: black;
          transform-origin: 0 0;
        }
        #dependency-lines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .dependency-line {
          stroke: black;
          stroke-width: 2;
        }
      </style>
      <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
      <script>
        var nestedSortables = document.querySelectorAll(".child");
        for (var i = 0; i < nestedSortables.length; i++) {
          new Sortable(nestedSortables[i], {
            group: "child",
            animation: 100,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            onChoose: function (evt) {
              evt.item.classList.add("highlight");
            },
            onUnchoose: function (evt) {
              evt.item.classList.remove("highlight");
            },
          });
        }
        
      </script>
      </div>
    `,
    headers: { "Content-Type": "text/html" },
  });

  router("/page/line", "GET", {
    text: /*html*/ `
      <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
      <button _="on click send hello to <form />">Send</button>
      <form _="on hello alert('got event')">
        <button
          _="on pointerdown
            repeat until event pointerup
              set rand to Math.random() * 255
              transition
                *background-color
                to \`hsl($rand 100% 90%)\`
                over 250ms
            end
            "
        >
          try me, press and hold
        </button>
      </form>
      <div id="GRAPH">
        <ul id="1000" class="child">
          <li class="dir" id="1001">Item 1</li>
          <li class="dir" id="1002">Item 2</li>
          <li class="dir" id="1003">Item 3</li>
        </ul>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
      <script>
        var nestedSortables = document.querySelectorAll(".child");
        for (var i = 0; i < nestedSortables.length; i++) {
          new Sortable(nestedSortables[i], {
            group: "child",
            animation: 100,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            onChoose: function (evt) {
              evt.item.classList.add("highlight");
            },
            onUnchoose: function (evt) {
              evt.item.classList.remove("highlight");
            },
          });
        }
      </script>
      <script>
        // SVGコンテナの参照を取得
        const svgContainer = document.getElementById("GRAPH");

        // 座標リストを初期化
        let coordinatesList = [];

        // 相手要素の座標を取得し、リストに保存する関数
        function getAndSaveCoordinates(element) {
          // data-edge属性を取得
          const edgeAttr = element.getAttribute("data-edge");
          if (edgeAttr) {
            // 相手要素のIDを配列として取得
            const targetIds = edgeAttr.split(",");
            targetIds.forEach((targetId) => {
              const targetElement = document.getElementById(targetId);
              if (targetElement) {
                // 自要素と相手要素の座標を取得
                const rect1 = element.getBoundingClientRect();
                const rect2 = targetElement.getBoundingClientRect();
                const startX =
                  rect1.left - svgContainer.getBoundingClientRect().left;
                const startY =
                  rect1.top - svgContainer.getBoundingClientRect().top;
                const endX =
                  rect2.left - svgContainer.getBoundingClientRect().left;
                const endY =
                  rect2.top - svgContainer.getBoundingClientRect().top;
                // 座標をリストに保存
                coordinatesList.push({
                  start: { x: startX, y: startY },
                  end: { x: endX, y: endY },
                });
              } else {
                console.log("Error: Target element not found");
              }
            });
          }
        }

        // 線を描画する関数
        function drawLines() {
          // 既存の線をクリア
          while (svgContainer.firstChild) {
            svgContainer.removeChild(svgContainer.firstChild);
          }
          // 新しい線を描画
          coordinatesList.forEach((coord) => {
            const line = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "line"
            );
            line.setAttribute("x1", coord.start.x);
            line.setAttribute("y1", coord.start.y);
            line.setAttribute("x2", coord.end.x);
            line.setAttribute("y2", coord.end.y);
            svgContainer.appendChild(line);
          });
        }

        <!-- // Mutation Observerのインスタンスを作成
        const observer = new MutationObserver((mutations) => {
          coordinatesList = []; // 座標リストをリセット
          document.querySelectorAll("[data-edge]").forEach((element) => {
            getAndSaveCoordinates(element);
          });
          drawLines(); // 線を再描画
        });

        // 監視の設定
        const config = { attributes: true, childList: true, subtree: true };

        // SVGコンテナの監視を開始
        observer.observe(svgContainer, config); -->
      </script>
    `,
    headers: { "Content-Type": "text/html" },
  });

  router("/page/dsd", "GET", {
    text: /*html*/ `
      <d-s-d>
        <template shadowrootmode="open">
          <style>
            button {
              padding: 10px;
              background-color: #008cba; /* Blue */
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
            button:hover {
              background-color: #005f5f; /* Darker blue on hover */
            }
          </style>
          <button><slot></slot></button>
        </template>
        button slot
      </d-s-d>
      <script>
        class DSD extends HTMLElement {
          constructor() {
            super();
            this.attachListeners();
          }
          attachListeners() {
            this.shadowRoot
              .querySelector("button")
              .addEventListener("click", () => {
                alert("Button clicked!");
              });
          }
        }
        if (customElements.get("d-s-d") === undefined)
          customElements.define("d-s-d", DSD);
      </script>
    `,
    headers: { "Content-Type": "text/html" },
  });

  workbox.routing.registerRoute(
    new RegExp(`/api/form`),
    ({ event }) => {
      if (event.request.method === "POST") {
        return event.request.text().then((body) => {
          return new Response(body + "hello");
        });
      }
      return new Response();
    },
    "POST"
  );
}
