import { GtEditor } from "./GtEditor";
import { GtSelection } from "./GtSelection";

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export default class GtEditorContent extends GtEditor {

    /**
     * @param {GtFunctionalityCollection} functionalityCollection
     * @param {Element} [editorParentElement]
     * @param {object} [templateStateData]
     */
    constructor(functionalityCollection, editorParentElement, templateStateData) {

        super();

        this.templateStateData = templateStateData;
        this.setStates(functionalityCollection);
        this.editorContentElement = null;
        this.wrapperElement = editorParentElement;
        this.isStyleChanged = false;
        this.preventSelectionChange = false;
        this.editorContentElementInit = false;

        this.initCurrentStyle();

        /**
         * @type {GtSelection}
         */
        this.gtSelection = new GtSelection();

        if (this.wrapperElement) {
            this.render(this.wrapperElement);
        }
    }

    /**
     * @param {Element} [editorParentElement]
     * @param {Any} [text]
     * @returns {GtEditor}
     */
    render(editorParentElement, text, onChange) {
        this.wrapperElement = editorParentElement;
        this.editorContentElement = this.createNewNode('div', null, ['content', 'focus'], null, null, null, { "contenteditable": true });

        this.editorContentElement.addEventListener('keydown', (event) => {
            this.onKeyUp(event);
        });

        this.editorContentElement.addEventListener('focus', (event) => {
            event.target.classList.remove('focus');
        });

        let selection = new GtSelection();
        document.addEventListener('selectionchange', (event) => {
            let { startNode } = this.gtSelection.getCursorInfo();
            if (startNode == null) {
                return false;
            }
            let contentElement = startNode.closest('.content');
            if (contentElement !== this.editorContentElement) {
                return false;
            }
            this.onSelectionchange(event);
        });

        this.editorContentElement.addEventListener('keyup', (event) => {
            text.text = this.editorContentElement.innerHTML;
            onChange();
        });


        // this.editorContentElement.innerHTML = '<p style="text-align: left;"><span style="font-weight: 300;">moshe</span><span style="font-weight: 300; text-decoration: underline;">​gilad</span><span style="font-weight: 700; text-decoration: underline;">​takoni</span></p><p style="text-align: left;"><span style="font-weight: 700; text-decoration: underline;">jermi</span><span style="font-weight: 700;">​as</span></p><p style="text-align: left;"><span style="font-weight: 700;">chanie</span><span style="font-weight: 300;">​edri</span></p><ul><li><ul><li><span style="font-weight: 300;">asd</span><span style="font-weight: 700;">​ariel</span></li></ul></li></ul> <p style="text-align: left;"><span style="font-weight: 700;">gilad</span><span style="font-weight: 700; text-decoration: underline;">​takoni</span></p><p style="text-align: left;"><span style="font-weight: 700; text-decoration: underline;">sara</span><span style="font-weight: 300; text-decoration: underline;">​blumental</span><span style="font-weight: 300;">​alexmayler</span><span style="font-weight: 300;">​</span></p>';
        // this.editorContentElement.innerHTML = '<p style="text-align: left;"><span style="font-weight: 300;">Join the Israel JCC for a special Yom Ha\'atzmaut screening of Mekonen: the Journey of an African Jew: DATE: May 9, 2016 TIME: 8:00 PM LOCATION: 67 Independence Lane RSVP: Binyamin N – Israeljcc@gmail.com</span></p>';
        // this.editorContentElement.innerHTML = '<p style="text-align: center;"><span style="font-weight: 300;">Join the Israel JCC for a special Yom Ha\'atzmaut </span></p><p style="text-align: center;"><span style="font-weight: 300;">screening of </span><span style="font-weight: 700;">Mekonen: the Journey of an African Jew:</span><span style="font-weight: 300;"> </span></p><p style="text-align: left;"><span style="font-weight: 700;">DATE</span><span style="font-weight: 300;">: May 9, 2016 </span></p><p style="text-align: left;"><span style="font-weight: 700;">TIME</span><span style="font-weight: 300;">: 8:00 PM </span></p><p style="text-align: left;"><span style="font-weight: 700;">LOCATION</span><span style="font-weight: 300;">: 67 Independence Lane </span></p><p style="text-align: left;"><span style="font-weight: 700;">RSVP</span><span style="font-weight: 300;">: Binyamin N – Israeljcc@gmail.com</span></p>';

        if (text) {
            this.editorContentElement.innerHTML = text.text;
        }

        this.wrapperElement.appendChild(this.editorContentElement);
        return this;
    }

    onSelectionchange(event) {

        if (this.isStyleChanged) {
            return;
        }

        let { startNode } = this.gtSelection.getCursorInfo(),
            stateData, newIndex, length, i = 0, currentStyleToUpdate;

        if (startNode.nodeName != 'SPAN') {
            return;
        }

        let stylesNotEqual = this.compareCurrentStyle(startNode);
        let state,
            button;

        if (length = stylesNotEqual.length) {
            for (; i < length; i++) {
                currentStyleToUpdate = stylesNotEqual[i];
                state = currentStyleToUpdate.state;
                stateData = this.getStateData(state);
                newIndex = stateData.style.values.indexOf(currentStyleToUpdate.nodeStyleValue);
                // button = this.getStateButton(state);
                state.setCurrentIndex(newIndex);
                state.action('editor:updateStateByCurrentNode', button);
            }
        }
    }

    getStateButton(state) {
        let wrapper = document.querySelector('[data-state-name="' + state.stateName + '"]');
        let s = '[data-selection-index="' + state.getCurrentIndex() + '"]';

        return wrapper && wrapper.querySelector(s);
    }

    checkIfSplitRequired(event) {
        return (this.isStyleChanged || event.keyCode == 13);
    }

    setStyleToLine(lineElement) {
        this.setStyle(lineElement, 'text-align', this.currentStyle['text-align'].value);
    }

    onKeyUp(event) {

        //#TODO implement when user press delete and cursor in offset == 0 in wordwrapper element

        if (this.editorContentElementInit && !this.isStyleChanged) { //#TODO add no enter key==13
            return;
        }

        /**
         * 40 arrow bottom
         * 38 arrow top
         * 37 arrow left
         * 39 arrow right
         */
        if (event.keyCode == 8 || event.keyCode == 40 || event.keyCode == 38 || event.keyCode == 37 || event.keyCode == 39) {
            return;
        }

        event = event || window.event;
        let key = event.which || event.keyCode; // keyCode detection
        let ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false); // ctrl detection

        /**
         * key == 86 -> Ctrl + V Pressed
         * key == 67 -> Ctrl + C Pressed
         * key == 66 -> Ctrl + B Pressed
         * key == 85 -> Ctrl + U Pressed
         * key == 73 -> Ctrl + I Pressed
         */
        if (ctrl && [86, 67, 66, 65, 85, 63].indexOf(key) == -1) {
            return;
        }

        if (!this.hasChildren(this.editorContentElement)) {

            let lineElement = this.createNewLine();
            let wordwrapper = this.createNewNode('span', null, null, null, null, "\u200B");
            this.setStyleWordwrapper(wordwrapper);
            lineElement.appendChild(wordwrapper);
            this.editorContentElement.appendChild(lineElement);
            this.setStyleToLine(lineElement);
            this.gtSelection.updateRange(wordwrapper, wordwrapper, 0, 1);
            this.editorContentElementInit = true;
            this.isStyleChanged = false;
            return;
        }

        if (!this.checkIfSplitRequired(event)) {
            return;
        }

        let { startNode, endNode, startOffset, endOffset } = this.gtSelection.getCursorInfo();


        //#TODO fix bug when press enter and cursor in and of the line

        // keyCode 13 -> Enter key
        if (event.keyCode == 13) {
            let { firstElement, lastElement } = this.splitText(startNode, 0, endOffset);
            let nextElement,
                currentElement,
                newlineElement,
                startNodeLineElement,
                frag = document.createDocumentFragment();

            //#TODO rewrite this part

            startNodeLineElement = this.getLineElement(firstElement);

            if (firstElement !== lastElement) {
                this.cloneStyle(firstElement, lastElement);
            }

            nextElement = lastElement;
            let elementLength = (nextElement.firstChild.length == endOffset);
            startOffset = endOffset = 0;
            if (elementLength) {
                nextElement = lastElement = nextElement.nextElementSibling || this.cloneStyle(firstElement, this.createNewWordwrapperElement());
            }



            do {
                currentElement = nextElement;
                nextElement = currentElement.nextElementSibling;
                if (currentElement) {
                    frag.appendChild(currentElement);
                }
            } while (nextElement);

            if (lastElement.innerText == "" || lastElement.innerText == " ") {
                lastElement.innerText = "\u200B";
            }

            // endOffset = lastElement.innerText == "\u200B" ? 1 : 0;

            newlineElement = this.createNewLine();
            this.setStyleToLine(newlineElement);

            newlineElement.appendChild(frag);
            this.insertAfter(newlineElement, startNodeLineElement);
            if (startNodeLineElement.childNodes.length == 0) {
                startNodeLineElement.appendChild(this.cloneStyle(firstElement, this.createNewWordwrapperElement()));
            }
            this.gtSelection.updateRange(lastElement.firstChild, lastElement.firstChild, startOffset, endOffset);

            this.isStyleChanged = false;
        }

        if (this.isStyleChanged) {
            let wordwrapper,
                line,
                { firstElement, lastElement } = this.splitText(startNode, 0, endOffset);

            wordwrapper = this.createNewWordwrapperElement();

            this.setStyleWordwrapper(wordwrapper);
            this.cloneStyle(firstElement, lastElement);

            if (endOffset == 0) {
                line = this.getLineElement(firstElement);
                line.insertBefore(wordwrapper, firstElement);
            } else {
                this.insertAfter(wordwrapper, firstElement);
            }
            this.gtSelection.updateRange(wordwrapper.firstChild, null, 0, 1);
        }

        this.isStyleChanged = false;

        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }

    }

    /**
     *
     * @param element
     * @returns {*}
     */
    getLineElement(element) {
        //#TODO change closest ul element
        return element.closest('p') || element.closest('ul');
    }

    createNewLine(isNotEmpty) {
        return this.createNewNode('p', null, null, null, null, isNotEmpty ? "\u200B" : '');
    }

    createNewWordwrapperElement() {
        return this.createNewNode('span', null, null, null, null, "\u200B");
    }

    setStyleWordwrapper(wordwrapper) {
        this.setStyleByCollection(wordwrapper, this.currentStyle, ['text-align']);
    }



    onStateChange(state, eventName) {

        this.updateCurrentStyleByState(state);

        if (eventName == 'toolbar:stateValueChange') {
            let { isStyleChanged, elementsToApplyStyle, startNode, endNode, endOffset, restoreRange } = this.checkBeforeApplyStyle(state);
            this.isStyleChanged = isStyleChanged;
            if (elementsToApplyStyle.length > 0) {
                this.applyStyle(this.getCurrentStyle(state), elementsToApplyStyle);
                if (restoreRange) {
                    this.gtSelection.updateRange(startNode, endNode, 0, endOffset);
                }
            }
        }

    }

    checkBeforeApplyStyle(state) {

        let { startNode, endNode, startOffset, endOffset, range } = this.gtSelection.getCursorInfo();

        let lineElementOfStartNode,
            lineElementOfEndNode,
            isStyleChanged = false,
            restoreRange = false,
            isStateLine = this.isStateOfLine(state),
            style = this.getCurrentStyle(state),
            elementsToApplyStyle = [];

        if (!this.gtSelection.isTextSelected()) {
            let element = startNode;
            if (isStateLine) {
                element = this.getLineElement(startNode);
            }

            isStyleChanged = !this.hasStyle(element, style.key, style.value);
            if (isStyleChanged && isStateLine) {
                elementsToApplyStyle.push(element);
            }

        } else {
            if (startNode === endNode) {

                if (isStateLine) {
                    elementsToApplyStyle.push(this.getLineElement(startNode));
                } else {

                    let { firstElement, middleElement, lastElement } = this.splitText(startNode, startOffset, endOffset, true);
                    restoreRange = (firstElement !== lastElement);

                    if (restoreRange) {

                        if (middleElement) {
                            startNode = middleElement;
                            endNode = middleElement;
                        } else {
                            if (startOffset == 0) {
                                startNode = firstElement;
                                endNode = firstElement;
                            } else {
                                startNode = lastElement;
                                endNode = lastElement;
                            }
                        }

                        endOffset = (endOffset - startOffset);
                    }



                    if (firstElement === lastElement) {
                        elementsToApplyStyle.push(firstElement);
                    } else {
                        if (middleElement != null) {
                            this.cloneStyle(firstElement, lastElement);
                            elementsToApplyStyle.push(middleElement);
                        } else {
                            if (startOffset == 0) {
                                this.cloneStyle(firstElement, lastElement);
                            }
                            elementsToApplyStyle.push(startOffset == 0 ? firstElement : lastElement);
                        }
                    }
                }

            } else {

                if (isStateLine) {
                    lineElementOfStartNode = this.getLineElement(startNode);
                    lineElementOfEndNode = this.getLineElement(endNode);

                    let currentElement = lineElementOfStartNode;

                    do {

                        if (!this.hasStyle(currentElement, style.key, style.value)) {
                            elementsToApplyStyle.push(currentElement);
                        }

                    } while (currentElement !== lineElementOfEndNode && (currentElement = currentElement.nextElementSibling));


                } else {

                    startNode = this.splitText(startNode, 0, startOffset, true)['lastElement'];
                    endNode = this.splitText(endNode, 0, endOffset, true)['firstElement'];
                    restoreRange = (startNode !== endNode);

                    elementsToApplyStyle = this.getAllNodes(startNode, endNode, 'SPAN');

                }

            }

        }


        return {
            isStyleChanged: isStyleChanged,
            elementsToApplyStyle: elementsToApplyStyle,
            startNode: startNode.firstChild,
            endNode: endNode.firstChild,
            endOffset: endOffset,
            startOffset: startOffset,
            restoreRange: restoreRange
        };
    }

    getCurrentStyle(state) {
        return this.currentStyle[state.stateName];
    }

    isStateOfLine(state) {
        return state.stateName == 'text-align' || state.stateName == 'direction';
    }

    applyStyle(style, elements) {

        let i = 0,
            element,
            elementsLength = elements.length;

        for (; i < elementsLength; i++) {
            element = elements[i];
            this.setStyle(element, style.key, style.value);
        }

        this.isStyleChanged = false;

    }

}