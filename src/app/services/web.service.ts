import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebService {
  uniqueID = ""
  hostURL = environment.host
  jobCompleted: boolean = false
  constructor(private http: HttpClient) {
    console.log(this.hostURL)
  }

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

  performAnalysis(extra_files: any) {
    return this.http.get(this.hostURL + `/api/diann/${this.uniqueID}/fasta/${extra_files["fasta"]}/gaf/${extra_files["gaf"]}/obo/${extra_files["obo"]}/`, {responseType: "text", observe: "body"})
  }

  getStatus() {
    return this.http.get(this.hostURL + `/api/status/${this.uniqueID}/`, {responseType: "text", observe: "response"})
  }
}
