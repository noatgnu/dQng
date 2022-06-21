import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WebService {
  uniqueID = ""
  hostURL = "http://dq.muttsu.com"
  jobCompleted: boolean = false
  constructor(private http: HttpClient) { }

  getUniqueID() {
    this.http.get(this.hostURL, {responseType: "text", observe: "body"}).subscribe(data => {
      this.uniqueID = data
    })
  }

  uploadFile(file: File) {
    const formData = new FormData()
    formData.append(file.name, file)
    return this.http.put(
      this.hostURL + "/api/upload/", formData, {
        headers: new HttpHeaders({
          "Content-Type": "text/plain",
          "Unique-ID": this.uniqueID,
          "Filename": file.name
        }),
        reportProgress: true,
        observe: "events",
        responseType: "blob"
      }
    )
  }

  performAnalysis() {
    return this.http.get(this.hostURL + `/api/diann/${this.uniqueID}/`, {responseType: "text", observe: "body"})
  }

  getStatus() {
    return this.http.get(this.hostURL + `/api/status/${this.uniqueID}/`, {responseType: "text", observe: "response"})
  }
}
