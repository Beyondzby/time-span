import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/core';
import { ISSUE_BASIC } from 'assets/issue';
import { environment } from 'environments/environment';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private octokit: Octokit;

  private readonly dayStart = moment()
    .hour(0)
    .minute(0)
    .second(0)
    .toISOString();

  constructor() {
    this.octokit = new Octokit({
      auth: environment.auth || localStorage.getItem('token'),
    });
    console.log(this.dayStart, 'day');
  }

  async issues() {
    const response = await this.octokit.graphql(
      `{
        repository(owner: "zyxbest", name: "db") {
          issues(last: 20, filterBy:{since:"${this.dayStart}"}) {
            edges {
              node {
                number
                title
                labels(first: 5) {
                  edges {
                    node {
                      name
                    }
                  }
                }
                body
                createdAt
                updatedAt
              }
              cursor
            }
          }
        }
      }`
    );
    return response;
  }

  post(span: number, content: string) {
    return this.octokit.request('POST /repos/{owner}/{repo}/issues', {
      ...ISSUE_BASIC,
      title: span,
      body: content,
    });
  }

  update(id: number, body: string) {
    return this.octokit.request(
      'PATCH /repos/{owner}/{repo}/issues/{issue_number}',
      {
        ...ISSUE_BASIC,
        issue_number: id,
        body,
      }
    );
  }
}
