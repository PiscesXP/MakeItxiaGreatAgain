class EventEmitter {
  eventList = {};

  emit(eventName, ...args) {
    const e = this.eventList[eventName];
    if (e && Array.isArray(e)) {
      e.forEach(listener => {
        listener(...args);
      });
    }
    return this;
  }

  listen(eventName, listener) {
    const e = this.eventList[eventName];
    if (e && Array.isArray(e)) {
      e.push(listener);
    } else {
      this.eventList[eventName] = [listener];
    }
    return this;
  }
}

export { EventEmitter };
