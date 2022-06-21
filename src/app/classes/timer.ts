export class Timer {
  currentTime = 0
  interval: any
  currentHMS = ""
  start() {
    this.interval = setInterval(() => {
      this.currentTime ++
      this.currentHMS = this.convertToHMS()
    }, 1000)
  }

  pause() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  clear() {
    this.currentTime = 0
  }

  convertToHMS() {
    return new Date(this.currentTime * 1000).toISOString().substr(11, 8)
  }
}
