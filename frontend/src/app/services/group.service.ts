import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Group } from "../model/entities/group.model";
import { BASE_URL } from "../app.constants";
import { GroupDTO } from "../model/dto/group.dto";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  GROUP_ROTE = 'groups';

  constructor(private http: HttpClient) {}

  create(groupDto: GroupDTO, userId?: number): Observable<Group> {
    if(userId) {
      return this.http.post<Group>(`${BASE_URL}/${this.GROUP_ROTE}?userId=${userId}`, groupDto);
    }
    return this.http.post<Group>(`${BASE_URL}/${this.GROUP_ROTE}`, groupDto);
  }

  getGroupsForUser(userId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${BASE_URL}/${this.GROUP_ROTE}?userId=${userId}`);
  }

  getGroupByCode(code: string, userId: number): Observable<Group> {
    return this.http.put<Group>(`${BASE_URL}/${this.GROUP_ROTE}?code=${code}&userId=${userId}`, {});
  }

}
