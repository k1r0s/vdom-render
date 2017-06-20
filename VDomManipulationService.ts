import * as h from "virtual-dom/h"
import * as tohscript from "html2hscript"

import * as createElement from "virtual-dom/create-element"
import * as patch from "virtual-dom/patch"
import * as diff from "virtual-dom/diff"

function compileHScript (htmlStr: string = "", cbk: Function) {
  tohscript(htmlStr.trim(), (err, hscript) => {
    if (err) { throw err }
    (function(h){ cbk(eval(hscript)) })(h)
  })
}

export class VDomManipulationService {

  static render (appendTo: HTMLElement, html: string) {
    compileHScript(html, (newVdom) => {
      let oldHtml = (<HTMLElement>appendTo.firstChild).outerHTML
      if (oldHtml) {
        compileHScript(oldHtml, oldVDom =>
          patch(appendTo.firstChild, diff(oldVDom, newVdom)))
      } else {
        let node: HTMLElement = createElement(newVdom)
        appendTo.innerHTML = node.outerHTML
      }
    })
  }
}
