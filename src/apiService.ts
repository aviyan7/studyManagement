import {HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class ApiService {

  public static readonly baseApi = 'http://localhost:8080/api/v1/';

  constructor(private httpClient: HttpClient) {
  }

  getArticles() {
    return this.httpClient.get(ApiService.baseApi + 'articles');
  }

  getAllSubGroups() {
    return this.httpClient.get(ApiService.baseApi + 'subGroup');
  }

  getUserById(id: any){
    return this.httpClient.get(ApiService.baseApi+'user/'+id);
  }

  getPostById(id: any){
    return this.httpClient.get(ApiService.baseApi+'post/'+id);
  }

  getRecommendedPosts(id: any){
    return this.httpClient.get(ApiService.baseApi+'post/recommendation/'+id);
  }
  getAllPosts(page?: number, size?: number) {
    let params;
    if(page && size){
      params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
    }
    return this.httpClient.get(ApiService.baseApi + 'post', {params});
  }

  getTotalPosts(){
    return this.httpClient.get(ApiService.baseApi + 'post/all');
  }

  login(userCredentials: any) {
    return this.httpClient.post(ApiService.baseApi + 'auth/authenticate', userCredentials, {withCredentials: true});
  }

  joinsubGroup(id: any){
    return this.httpClient.get(ApiService.baseApi+'subGroup/join/'+id);
  }

  removeSubGroup(id: any){
    return this.httpClient.get(ApiService.baseApi+'subGroup/remove/'+id);
  }

  getLoggedInUserDetails() {
    return this.httpClient.get(ApiService.baseApi + 'user', {withCredentials: true});
  }

  updateVote(id: number, voteType: any) {
    return this.httpClient.post(ApiService.baseApi + 'articles/' + id + '/vote/', voteType, {withCredentials: true});
  }

  register(userDetails: any) {
    return this.httpClient.post(ApiService.baseApi + 'auth/register', userDetails);
  }

  getRelatedArticles(id: number) {
    return this.httpClient.get(ApiService.baseApi + 'articles/' + id + '/similar');
  }

  logout() {
    return this.httpClient.post(ApiService.baseApi + 'logout', {}, {withCredentials: true})
  }

  post(post: any) {
    return this.httpClient.post( ApiService.baseApi + 'post', post, {withCredentials: true})
  }

  forgotPassword(email: string) {
    return this.httpClient.post(ApiService.baseApi + 'auth/email/forgot-password', email, {withCredentials: true})
  }

  resetPassword(resetData: any) {
    return this.httpClient.post(ApiService.baseApi + 'reset-password/', resetData)
  }

  getAllUsers() {
    return this.httpClient.get (ApiService.baseApi + 'user/users', {withCredentials: true})
  }

  promoteDemoteUser(id: number, promoteDemoteData: any) {
    return this.httpClient.post(ApiService.baseApi + 'user/' + id + '/promote-demote/', promoteDemoteData, {withCredentials: true})
  }

  deleteUser(userId: any) {
    return this.httpClient.delete(ApiService.baseApi + 'user/delete/' + userId, {withCredentials: true})
  }

  getApprovalPendingUsers() {
    return this.httpClient.get(ApiService.baseApi + 'approval-requests', {withCredentials: true})
  }

  approveUser( userId: any) {
    return this.httpClient.post(ApiService.baseApi + 'approve-user/', userId, {withCredentials: true})
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    // Set custom headers without the "Expect" header
    const headers = new HttpHeaders();
    headers.set('Accept', 'application/json');

    const req = new HttpRequest('POST', 'http://localhost:8080/api/v1/files/upload', formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'json'
    });

    return this.httpClient.request(req);
  }

  getFiles(): Observable<any> {
    return this.httpClient.get(ApiService.baseApi+'/files');
  }

  postComment(data: any): Observable<any> {
    return this.httpClient.post(ApiService.baseApi+'comments',data);
  }

  createSubGroup(data: any): Observable<any> {
    return this.httpClient.post(ApiService.baseApi+'subGroup',data);
  }

  searchPost(data: string): Observable<any> {
    return this.httpClient.get(ApiService.baseApi+'post/search?keyword='+data);
  }

}
