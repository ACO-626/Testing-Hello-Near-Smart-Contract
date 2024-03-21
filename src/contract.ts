// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view } from 'near-sdk-js';

@NearBindgen({})
class HelloNear {
  greetings: Object = {};

  @view({}) // This method is read-only and can be called for free
  get_message({ account_id }: { account_id: string }): string {
   return this.greetings[account_id] || 'Not Found';
  }

  @call({}) // This method changes the state, for which it cost gas
  set_message({ message }: { message: string }): void {
    this.greetings[near.predecessorAccountId()] = message;
  }
}