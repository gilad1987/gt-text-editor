import { GtDomUtil } from "./GtDomUtil";

/**
 * @date 13.7.2016
 * @author Gilad Takoni
 */
export default class GtSelection extends GtDomUtil {

    constructor() {
        super();
    }


    getCurrentRange() {
        let s = window.getSelection();
        return s.getRangeAt(0);
    }

    /**
     * @param {Range} [range]
     * @returns {{startNode: Node, endNode: Node}}
     */
    getCursorInfo(range) {

        let s = window.getSelection();
        if (s.type == 'None') {
            return {
                startNode: null,
                endNode: null,
                startOffset: 0,
                endOffset: 0,
                range: null
            }
        }
        let r = range ? range : s.getRangeAt(0);

        return {
            startNode: r.startContainer.nodeName == 'SPAN' ? r.startContainer : r.startContainer.parentNode,
            endNode: r.endContainer.nodeName == 'SPAN' ? r.endContainer : r.endContainer.parentNode,
            startOffset: r.startOffset,
            endOffset: r.endOffset,
            range: r
        }
    }


    isTextSelected() {
        let { startNode, endNode, startOffset, endOffset } = this.getCursorInfo();
        return (startNode === endNode && (startOffset - endOffset != 0)) || startNode !== endNode;
    }

    addRange(startNode, endNode, startOffset, endOffset) {
        let range = document.createRange(),
            selection = window.getSelection();

        range.selectNode(startNode);
        range.setStart(startNode.firstChild ? startNode.firstChild : startNode, 0);
        range.setEnd(startNode.firstChild ? startNode.firstChild : startNode, 0);

        selection.removeAllRanges();
        // console.log('addRange');
        selection.addRange(range);

        return range;
    }

    updateRange(startNode, endNode, startOffset, endOffset) {
        let range = document.createRange(),
            selection = window.getSelection();

        endNode = endNode ? endNode : startNode;
        startOffset = startOffset ? startOffset : 0;
        endOffset = endOffset ? endOffset : 0;

        range.setStart(startNode ? startNode : startNode, startOffset);
        range.setEnd(endNode ? endNode : endNode, endOffset);

        selection.removeAllRanges();
        selection.addRange(range);

        return range;
    }

    restoreSelection(range, deleteContent, startOffset, endOffset) {
        if (range) {
            deleteContent = typeof deleteContent == 'undefined' ? false : deleteContent;
            let sel = window.getSelection();

            if (deleteContent) {
                range.deleteContents();
            }

            if (startOffset) {
                range.setStart(range.startContainer, startOffset);
            }
            if (endOffset) {
                range.setEnd(range.startContainer, endOffset);
            }
            sel.removeAllRanges();
            // console.log('restoreSelection');
            sel.addRange(range);
        }
    }

    changeSelection(node, before) {
        let s = window.getSelection();
        let r = s.getRangeAt(0);
        s.removeAllRanges();
        r = r.cloneRange();
        if (before) {
            r.setStartBefore(node);
        } else {
            r.setStartAfter(node);
        }
        s.addRange(r);
        return r;
    }

}