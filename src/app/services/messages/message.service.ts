import { Injectable } from '@angular/core';

//injectable -> may have dependencies injected into service
//            -> not necessary in message service
@Injectable()
export class MessageService {
  messages: string[] = [];

  
  constructor() { }



}
