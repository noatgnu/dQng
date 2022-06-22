import { interval } from "rxjs/internal/observable/interval"

export class Timer {
  currentTime = 0
  interval: any
  currentHMS = ""
  start() {
    if (this.interval) {
      this.interval.unsubscribe()
    }
    this.interval = interval(1000).subscribe(value => {
      this.currentTime = value
      this.currentHMS = this.convertToHMS()
    })
  }

  pause() {
    if (this.interval) {
      this.interval.unsubscribe()
    }
  }

  clear() {
    this.currentTime = 0
  }

  convertToHMS() {
    return new Date(this.currentTime * 1000).toISOString().substr(11, 8)
  }
}
