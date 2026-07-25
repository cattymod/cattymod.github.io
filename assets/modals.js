(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("This extension requires unsandboxed mode");
    }

    let modal = null;
    let pressedButton = "";

    function escapeHTML(text) {
        return String(text)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
    }


    function createStyle() {
        if (document.getElementById("modals-style")) return;

        const style = document.createElement("style");
        style.id = "modals-style";

        style.textContent = `
        .scratch-modal-overlay {
            position: fixed;
            inset: 0;
            display:flex;
            justify-content:center;
            align-items:center;
            background:rgba(0,0,0,.25);
            z-index:999999;
            font-family:Helvetica,Arial,sans-serif;
        }

        .scratch-modal {
            width:320px;
            background:white;
            border-radius:12px;
            border:2px solid rgb(217,217,217);
            box-shadow:rgba(0,0,0,.15) 0px 6px 0px;
            overflow:hidden;
            position:relative;
        }

        .scratch-modal.large {
            width:85vw;
            height:85vh;
            max-width:1200px;
            max-height:800px;
            display:flex;
            flex-direction:column;
        }

        .scratch-modal-header {
            background:rgb(0,156,204);
            color:white;
            padding:10px 12px;
            font-size:14px;
            font-weight:bold;
            flex-shrink:0;
        }

        .scratch-modal-close {
            position:absolute;
            top:6px;
            right:10px;
            cursor:pointer;
            font-size:16px;
            font-weight:bold;
            color:white;
            user-select:none;
            z-index:2;
        }

        .scratch-modal-body {
            padding:16px;
            font-size:14px;
            color:rgb(51,51,51);
            text-align:center;
        }

        .scratch-modal.large .scratch-modal-body {
            flex:1;
            padding:0;
            margin:0;
            overflow:hidden;
        }

        .scratch-modal-body iframe {
            display:block;
            width:100%;
            height:100%;
            border:0;
        }

        .scratch-modal-footer {
            display:flex;
            justify-content:flex-end;
            gap:10px;
            padding:12px;
            background:rgb(242,242,242);
            border-top:1px solid rgb(221,221,221);
            flex-shrink:0;
        }

        .scratch-modal-button {
            padding:6px 14px;
            border-radius:6px;
            border:none;
            cursor:pointer;
            font-size:13px;
            font-weight:bold;
            color:white;
        }
        `;

        document.head.appendChild(style);
    }


    function closeModal() {
        if (modal) {
            modal.remove();
            modal = null;
        }
    }


    function openModal(title, content, iframe = false) {
        createStyle();

        closeModal();

        // Reset every time a modal opens
        pressedButton = "";

        modal = document.createElement("div");
        modal.className = "scratch-modal-overlay";


        const box = document.createElement("div");
        box.className = "scratch-modal";


        if (iframe) {
            box.classList.add("large");
        }


        box.innerHTML = `
            <div class="scratch-modal-close">✕</div>

            <div class="scratch-modal-header">
                ${escapeHTML(title)}
            </div>

            <div class="scratch-modal-body"></div>

            <div class="scratch-modal-footer"></div>
        `;


        const body = box.querySelector(".scratch-modal-body");


        if (iframe) {
            const frame = document.createElement("iframe");
            frame.src = content;
            body.appendChild(frame);
        } else {
            body.innerHTML = escapeHTML(content);
        }


        box.querySelector(".scratch-modal-close")
            .onclick = closeModal;


        modal.appendChild(box);
        document.body.appendChild(modal);
    }


    function addButton(name) {
        if (!modal) return;

        const footer =
            modal.querySelector(".scratch-modal-footer");


        const button = document.createElement("button");

        button.className = "scratch-modal-button";
        button.textContent = name;


        const colors = [
            "rgb(0,156,204)",
            "rgb(255,102,128)",
            "rgb(89,192,89)",
            "rgb(255,171,25)"
        ];

        button.style.background =
            colors[footer.children.length % colors.length];


        button.onclick = function () {
            pressedButton = name;
            closeModal();
        };


        footer.appendChild(button);
    }



    class Modals {

        getInfo() {
            return {
                id: "modals",
                name: "Modals",

                color1: "#009ccc",
                color2: "#0085b3",
                color3: "#006b8f",

                blocks: [

                    {
                        opcode: "showText",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "show modal title [TITLE] text [TEXT]",
                        arguments: {
                            TITLE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello!"
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "This is a Scratch style modal."
                            }
                        }
                    },

                    {
                        opcode: "showIframe",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "show web page modal title [TITLE] page [URL]",
                        arguments: {
                            TITLE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "CattyMod Editor"
                            },
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "https://studio.cattymod.app/editor"
                            }
                        }
                    },

                    {
                        opcode: "addButton",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "add button called [NAME] to current modal",
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "OK"
                            }
                        }
                    },

                    {
                        opcode: "buttonPressed",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "button pressed"
                    },

                    {
                        opcode: "close",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "close modal"
                    }
                ]
            };
        }


        showText(args) {
            openModal(
                args.TITLE,
                args.TEXT,
                false
            );
        }


        showIframe(args) {
            openModal(
                args.TITLE,
                args.URL,
                true
            );
        }


        addButton(args) {
            addButton(args.NAME);
        }


        buttonPressed() {
            return pressedButton;
        }


        close() {
            closeModal();
        }
    }


    Scratch.extensions.register(new Modals());

})(Scratch);
