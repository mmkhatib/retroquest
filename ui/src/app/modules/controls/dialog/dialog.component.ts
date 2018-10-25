/*
 * Copyright (c) 2018 Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {Component, HostBinding, HostListener, OnInit, Input} from '@angular/core';

@Component({
  selector: 'rq-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})

export class DialogComponent implements OnInit {

  @HostBinding('style.display') display: string;

  _visible: boolean;

  public ngOnInit(): void {
    this.visible = true;
  }


  @Input() set visible(visible: boolean) {
    this._visible = visible;
    this.display = this._visible ? 'flex' : 'none';
    console.log(this.display);
  }

  get visible(): boolean {
    return this._visible;
  }

  public open(): void {
    this.visible = true;
  }

  public close(): void {
    this.visible = false;
  }

  @HostListener('click') onClick(): void {
    this.visible = false;
  }
}
