import { Component, OnInit } from '@angular/core';
import {WebService} from "../services/web.service";
import {HttpEventType} from "@angular/common/http";
import {delay, interval, retry, retryWhen, startWith, switchMap, take} from "rxjs";
import {TimerService} from "../services/timer.service";

@Component({
  selector: 'app-multiple-file-uploader',
  templateUrl: './multiple-file-uploader.component.html',
  styleUrls: ['./multiple-file-uploader.component.scss']
})
export class MultipleFileUploaderComponent implements OnInit {

  files = ["annotation.txt", "Reports.stats.tsv", "Reports.pg_matrix.tsv", "Reports.pr_matrix.tsv", "Reports.log.txt"]
  progress: any = {}
  fileList: any[] = []
  analysisProgress: any[] = []
  job_status: string = ""
  extra: string[] = ["fasta", "gaf"]
  extra_files: any = {
    "fasta": "",
    "gaf": ""
  }
  constructor(public web: WebService, private timer: TimerService) {
    this.web.getUniqueID()
  }

  ngOnInit(): void {
  }

  processFolder(files: any){
    this.fileList = files
    if (files.length > 0) {
      for (const f of files) {
        if (this.files.includes(f.name)) {
          this.progress[f.name] = 0
          const resp = this.web.uploadFile(f)
          resp.subscribe(ev => {
            if (ev.type == HttpEventType.UploadProgress) {
              // @ts-ignore
              this.progress[f.name] = Math.round(100 * (ev.loaded / ev.total));
            }
          })
        }
      }
    }
  }

  processSingle(files: any, type: string) {
    console.log(files)
    if (files.length >0) {
      const f = files[0]
      this.fileList.push(f)
      this.progress[f.name] = 0
      this.extra_files[type] = f.name
      const resp = this.web.uploadFile(f)
      resp.subscribe(ev => {
        if (ev.type == HttpEventType.UploadProgress) {
          console.log(ev)
          // @ts-ignore
          this.progress[f.name] = Math.round(100 * (ev.loaded / ev.total));
        }
      })
    }
  }

  performAnalysis() {
    this.web.jobCompleted = false
    this.timer.timer.start()
    this.web.performAnalysis(this.extra_files).subscribe(res => {
      const poll = interval(30000).pipe(
        startWith(0),
        switchMap(() => this.web.getStatus()), retryWhen((errors) => errors.pipe(
          delay(30000), take(10))
        )
        ).subscribe(res => {
        const status = res.headers.get("Job-Status")
        if (status) {
          this.job_status = status
        }
        if (res.body) {
          const progress: any[] = []
          const data = res.body.split(/[\r\n]+/)
          for (const line of data) {
            const row = line.split(/\t/)
            if (row.length > 1) {
              progress.push({time: new Date(parseFloat(row[0])*1000).toLocaleString("en-GB"), task: row[1]})
            }
          }
          this.analysisProgress = progress
        }
        if (status) {
          if (status === "finished"|| status === "failed") {
            this.timer.timer.pause()
            if (status === "finished") {
              this.web.jobCompleted = true

            }
            poll.unsubscribe()
          }
        }
      }, error => {
        console.log(error)
      })
    })

  }
}
