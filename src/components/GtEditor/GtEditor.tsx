import React from "react";
import GtEditorContent from "../../assets/gt-editor-lib/GtEditorContent";
import GtFunctionalityCollection from "../../assets/gt-editor-lib/GtFunctionalityCollection";
import GtState from "../../assets/gt-editor-lib/GtState";
import GtToolbar from "../../assets/gt-editor-lib/GtToolbar";
import { GtEditorStyled } from "./styled";

interface Props {}

class GtEditor extends React.PureComponent<Props, any> {
  states: any;
  statesGroup: any;
  statesMetadata: any;
  gtContent: any;
  gtToolbar: any;
  gtWrapper: any;

  constructor(props: Props) {
    super(props);

    this.gtContent = React.createRef();
    this.gtToolbar = React.createRef();
    this.gtWrapper = React.createRef();

    this.states = [
      new GtState("font-weight", true),
      new GtState("text-decoration", true),
      new GtState("font-style", true),
      new GtState("font-size", true),
      new GtState("text-align", true),
      new GtState("color", true),
    ];

    this.statesGroup = [];

    this.statesGroup.push({
      color: this.states[5],
    });

    this.statesGroup.push({
      "font-weight": this.states[0],
      "text-decoration": this.states[1],
      "font-style": this.states[2],
    });

    this.statesGroup.push({
      "font-size": this.states[3],
    });

    this.statesGroup.push({
      "text-align": this.states[4],
    });

    this.statesMetadata = {
      "font-weight": {
        type: "toggle", // options --> toggle / group / list
        style: {
          key: "font-weight",
          values: ["300", "700"],
        },
        buttons: {
          700: {
            nodeName: "button",
            elementAttrs: {
              type: "button",
              title: "bold",
            },

            icon: '<span style="font-weight: 700">B</span>',
          },
        },
      },

      "font-style": {
        type: "toggle", // options --> toggle / group / list
        style: {
          key: "font-style",
          values: ["", "italic"],
        },
        buttons: {
          italic: {
            nodeName: "button",
            elementAttrs: {
              type: "button",
              title: "italic",
            },

            icon: '<span style="font-style: italic">I</span>',
          },
        },
      },

      "text-decoration": {
        type: "toggle", // options --> toggle / group / list
        style: {
          key: "text-decoration",
          values: ["", "underline"],
        },
        buttons: {
          underline: {
            nodeName: "button",
            elementAttrs: {
              type: "button",
              title: "underline",
            },

            icon: '<span style="text-decoration: underline">U</span>',
          },
        },
      },

      "font-size": {
        type: "list", // options --> toggle / group / list
        label: "size",
        style: {
          key: "font-size",
          values: (function () {
            let sizes = [];
            for (let i = 10; i < 50; i++) {
              if (i % 2 == 0) {
                sizes.push(i + "px");
              }
            }
            return sizes;
          })(),
        },
        buttons: (function () {
          let buttons: any = {};

          for (let i = 10; i < 50; i++) {
            if (i % 2 == 0) {
              buttons[i + "px"] = {
                nodeName: "button",
                elementAttrs: {
                  type: "button",
                  title: "font-size: " + i + "px",
                },

                icon: i + "px",
              };
            }
          }

          return buttons;
        })(),
      },

      color: {
        type: "list", // options --> toggle / group / list
        label: "color",
        style: {
          key: "color",
          values: (function () {
            let values: any = [];

            ["#2088ca", "#184f9a", "#222222", "#444444", "#fd6d2a"].forEach(
              function (hex) {
                var result: any =
                  /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                result = result
                  ? ({
                      r: parseInt(result[1], 16),
                      g: parseInt(result[2], 16),
                      b: parseInt(result[3], 16),
                    } as any)
                  : null;

                values.push(
                  "rgb(" +
                    result["r"] +
                    ", " +
                    result["g"] +
                    ", " +
                    result["b"] +
                    ")"
                );
              }
            );

            return values;
          })(),
        },
        buttons: (function () {
          let buttons: any = {};
          ["#2088ca", "#184f9a", "#222222", "#444444", "#fd6d2a"].forEach(
            function (hex, index) {
              let result: any =
                /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
              let rgb: any;

              result = result
                ? ({
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16),
                  } as any)
                : null;

              rgb =
                "rgb(" +
                result["r"] +
                ", " +
                result["g"] +
                ", " +
                result["b"] +
                ")";

              buttons[rgb] = {
                nodeName: "button",
                elementAttrs: {
                  type: "button",
                  title: "color: " + hex,
                },

                icon: '<span class="color" style="color: ' + rgb + '">A</span>',
              };
            }
          );

          return buttons;
        })(),
      },

      "text-align": {
        type: "group", // options --> toggle / group / list
        label: "align",
        style: {
          key: "text-align",
          values: ["left", "right", "center", "justify"],
        },
        buttons: {
          left: {
            nodeName: "button",
            elementAttrs: {
              type: "button",
              title: "Text align left",
            },

            icon: '<i class="fa fa-align-left" aria-hidden="true"></i>',
          },
          right: {
            nodeName: "button",
            elementAttrs: {
              title: "Text align right",
              type: "button",
            },

            icon: '<i class="fa fa-align-right" aria-hidden="true"></i>',
          },
          center: {
            nodeName: "button",
            elementAttrs: {
              title: "Text align center",
              type: "button",
            },

            icon: '<i class="fa fa-align-center" aria-hidden="true"></i>',
          },
          justify: {
            nodeName: "button",
            elementAttrs: {
              title: "Text align justify",
              type: "button",
            },

            icon: '<i class="fa fa-align-justify" aria-hidden="true"></i>',
          },
        },
      },
    };
  }

  componentDidMount = () => {
    let editorStateCollection = new GtFunctionalityCollection();
    editorStateCollection.addStateCollection(this.states);
    let editor = new GtEditorContent(
      editorStateCollection,
      undefined,
      this.statesMetadata
    );
    editor.render(this.gtContent.current, { text: "" }, () => {});

    let toolbarFunctionalityCollection = new GtFunctionalityCollection();
    toolbarFunctionalityCollection.addStateCollection(this.states);
    let toolbar = new GtToolbar(
      toolbarFunctionalityCollection,
      undefined,
      this.statesMetadata
    );
    toolbar.render(this.gtToolbar.current, this.statesGroup);

    this.gtWrapper.current.addEventListener("click", (event: any) => {
      let target = event.target;
      let parent = target.closest(".gt-editor");
      let GtTextEditor =
        this.gtWrapper.current.getElementsByClassName("GtTextEditor")[0];
      let contentElement =
        this.gtWrapper.current.getElementsByClassName("content")[0];

      let isActive = parent && parent === this.gtWrapper.current;

      if (isActive) {
        GtTextEditor.classList.add("active");
        contentElement.setAttribute("contentEditable", true);
        contentElement.focus();
      } else {
        GtTextEditor.classList.remove("active");
        contentElement.setAttribute("contentEditable", false);
      }
    });
  };

  render() {
    return (
      <div className="gt-editor" ref={this.gtWrapper}>
        <GtEditorStyled className="GtTextEditor">
          <div ref={this.gtToolbar} />
          <div ref={this.gtContent} />
        </GtEditorStyled>
      </div>
    );
  }
}
export default GtEditor;
