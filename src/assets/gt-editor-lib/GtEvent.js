export class GtEvent {

    constructor() {
        /**
         * @desc Mapping of all event as subscribe in the instance
         * @type {Map}
         * @private
         */

        this._eventsMap = new Map();

    }

    /**
     * @desc Subscribe to event.
     * @param eventName
     * @param handler
     * @param context
     * @param target
     * @returns {GtEvent}
     */
    on(eventName, handler, context, target) {
        if (typeof handler != 'function') {
            return this;
        }

        let map = this._eventsMap,
            handlersCollection;

        if (map.has(eventName) == false) {
            map.set(eventName, []);
        }

        handlersCollection = map.get(eventName);


        /**
         *
         * @type {{next: null, previous: null, handler: *, context: null, target: *, applyHandler: node.applyHandler}}
         */
        var node = {
            next: null,
            previous: null,
            handler: handler,
            context: context ? context : handler,
            target: target ? target : null
        };


        /**
         *
         * @param target
         */
        node.applyHandler = function applyHandler(target) {

            if (this.target && (!target || (target && this.target !== target))) {
                return false;
            }

            this.handler.apply(this.context, arguments);

            if (this.next) {
                this.next.applyHandler.apply(this.next, arguments);
            }

        };

        handlersCollection.push(node);


        if (handlersCollection.length > 1) {
            var prev = handlersCollection[handlersCollection.length - 2];
            node.previous = prev;
            prev.next = node;
        }

        return this;
    }


    /**
     * @desc Remove subscribe function
     * @param eventName
     * @param handler
     * @returns {GtEvent}
     */
    off(eventName, handler) {

        let map = this._eventsMap,
            collectionHandlers = map.get(eventName);

        if (!collectionHandlers || (collectionHandlers.constructor !== Array) || (collectionHandlers.length == 0)) {
            return this;
        }

        if (typeof handler !== 'function') {
            map.delete(eventName);
            return this;
        }

        let length = collectionHandlers.length,
            i = 0;


        for (; i < length; i++) {

            if (collectionHandlers[i].handler === handler) {

                var prev = collectionHandlers[i].previous;
                var next = collectionHandlers[i].next;

                collectionHandlers.splice(i, 1);

                if (prev && prev.next !== null) {
                    prev.next = next;
                }

                if (next && next.previous !== null) {
                    next.previous = prev;
                }

                break;
            }
        }

        return this;

    }


    /**
     * Trigger of all subscribe function of event name, if pass the target
     * only function as subscribe with the target will be apply
     *
     * @param eventName
     * @param [target]
     */
    trigger(eventName, target) {
        if (this._eventsMap.has(eventName) === false) {
            return this;
        }

        let args = arguments[1]; //[].slice.call(arguments,1);
        let node = this._eventsMap.get(eventName)[0];

        node.applyHandler.apply(node, Array.isArray(args) ? args : [args]);

        return this;
    }
}