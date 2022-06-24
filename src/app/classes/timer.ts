import { interval } from "rxjs/internal/observable/interval"

export class Timer {
  currentTime = 0
  interval: any
  currentHMS = ""
  start() {

    if (this.interval) {
      this.interval.unsubscribe()
    }
    this.currentTime = Date.now()
    this.interval = interval(1000).subscribe(value => {
      const time = Date.now()
      const delta = time - this.currentTime
      this.currentHMS = this.convertToHMS(delta)
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

  convertToHMS(time: number) {
    return new Date(time).toISOString().slice(11, 11+8)
  }
}
