/*
 * Copyright (c) 2018 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {TaskComponent} from './task.component';
import {emptyThought} from '../../domain/thought';

describe('TaskComponent', () => {
  let component: TaskComponent;

  beforeEach(() => {
    component = new TaskComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleEditMode', () => {

    let originalTimeoutFunction = null;
    const fakeElementRef = {
      nativeElement: jasmine.createSpyObj({
        focus: null,
        select: null,
      })
    };

    beforeEach(() => {
      originalTimeoutFunction = window.setTimeout;
      window.setTimeout = (fn: Function) => fn();

      component.editableTextArea = fakeElementRef;
    });

    afterEach(() => {
      window.setTimeout = originalTimeoutFunction;
      fakeElementRef.nativeElement.focus.calls.reset();
      fakeElementRef.nativeElement.select.calls.reset();
    });

    it('should set the edit mode value to true', () => {
      component.taskEditModeEnabled = false;
      component.toggleEditMode();

      expect(component.taskEditModeEnabled).toBeTruthy();
    });

    it('should set the inner text value length to the task message length', () => {
      component.taskEditModeEnabled = false;
      component.task.message = 'aa';
      component.toggleEditMode();

      expect(component.taskMessage.length).toEqual(2);
    });

    it('should set the edit mode value to false', () => {
      component.taskEditModeEnabled = true;
      component.toggleEditMode();

      expect(component.taskEditModeEnabled).toBeFalsy();
    });

    it('should focus the title area when the edit mode is toggled true', () => {
      component.taskEditModeEnabled = false;
      component.toggleEditMode();
      expect(component.editableTextArea.nativeElement.focus).toHaveBeenCalled();
    });

    it('should not focus the title area when the edit mode is toggled false', () => {
      component.taskEditModeEnabled = true;
      component.toggleEditMode();
      expect(component.editableTextArea.nativeElement.focus).not.toHaveBeenCalled();
    });

    it('should select all the text in the div when focused', () => {
      component.taskEditModeEnabled = false;
      component.toggleEditMode();
      expect(component.editableTextArea.nativeElement.select).toHaveBeenCalled();
    });

    it('should not select all the text in the div when not focusesd', () => {
      component.taskEditModeEnabled = true;
      component.toggleEditMode();
      expect(component.editableTextArea.nativeElement.select).not.toHaveBeenCalled();
    });

  });

  describe(`editModeOff`, () => {
    it(`should emit message changed`, () => {
      component.messageChanged = jasmine.createSpyObj({emit: null});
      component.editModeOff();
      expect(component.messageChanged.emit).toHaveBeenCalled();
    });

    it(`should change taskEditModeEnabled to false`, () => {
      component.taskEditModeEnabled = true;
      component.editModeOff();
      expect(component.taskEditModeEnabled).toEqual(false);
    });

    it(`should not change taskEditModeEnabled to true`, () => {
      component.taskEditModeEnabled = false;
      component.editModeOff();
      expect(component.taskEditModeEnabled).toEqual(false);
    });
  });

  describe('addStar', () => {

    it('should increase the star count by one', () => {
      component.starCountIncreased = jasmine.createSpyObj({emit: null});

      component.task = emptyThought();
      component.task.hearts = 1;
      component.addStar();

      expect(component.task.hearts).toEqual(2);
    });

    it('should emit the star', () => {
      component.starCountIncreased = jasmine.createSpyObj({emit: null});

      component.task = emptyThought();
      component.task.hearts = 1;
      component.addStar();

      expect(component.starCountIncreased.emit).toHaveBeenCalledWith(2);
    });
  });

  describe('emitDeleteItem', () => {

    it('should emit the actionItem to be deleted is the deletion flag is set to true', () => {
      component.deleted = jasmine.createSpyObj({emit: null});
      component.task = emptyThought();
      component.task.hearts = 1;

      component.deleteWasToggled = true;
      component.emitDeleteItem();

      expect(component.deleted.emit).toHaveBeenCalledWith(component.task);
    });

    it('should not emit the actionItem to be deleted is the deletion flag is set to false', () => {
      component.deleted = jasmine.createSpyObj({emit: null});
      component.task = emptyThought();
      component.task.hearts = 1;

      component.deleteWasToggled = false;
      component.emitDeleteItem();

      expect(component.deleted.emit).not.toHaveBeenCalledWith(component.task);
    });

  });

  describe('emitTaskContentClicked', () => {

    it('should emit the actionItem when edit mode is not enabled', () => {
      component.taskEditModeEnabled = false;
      component.messageClicked = jasmine.createSpyObj({emit: null});

      component.task = emptyThought();
      component.task.hearts = 1;
      component.emitTaskContentClicked();

      expect(component.messageClicked.emit).toHaveBeenCalledWith(component.task);
    });

    it('should not emit the actionItem when edit mode is enabled', () => {
      component.taskEditModeEnabled = true;
      component.messageClicked = jasmine.createSpyObj({emit: null});

      component.task = emptyThought();
      component.task.hearts = 1;
      component.emitTaskContentClicked();

      expect(component.messageClicked.emit).not.toHaveBeenCalled();
    });

  });

  describe('forceBlur', () => {
    let originalTimeoutFunction = null;

    beforeEach(() => {
      originalTimeoutFunction = window.setTimeout;
      window.setTimeout = (fn: Function) => fn();
    });

    afterEach(() => {
      window.setTimeout = originalTimeoutFunction;
    });

    it('should call blur on the native textarea element', () => {
      component.editableTextArea = {
        nativeElement: jasmine.createSpyObj({
          blur: null
        })
      };
      component.forceBlur();

      expect(component.editableTextArea.nativeElement.blur).toHaveBeenCalled();
    });
  });

  describe('initializeTextAreaHeight', () => {
    it(`should set the height of the nativeElement of the text area to the content message height`, () => {
      component.editableTextArea = {
        nativeElement: {
          style: {
            height: ''
          },
          scrollHeight: 40
        }
      };

      component.initializeTextAreaHeight();
      expect(component.editableTextArea.nativeElement.style.height).toEqual('40px');
    });
  });

  describe('setMessageLength', () => {
    it('should set the text value length to the length of the input string', () => {
      component.setMessageLength('a');
      expect(component.textValueLength).toEqual(1);
    });
  });

  describe('updateTaskMessage', () => {
    const fakeText = 'HELLO I AM TEXT';
    let fakeEvent;

    beforeEach(() => {
      fakeEvent = jasmine.createSpyObj(['preventDefault']);
    });

    it('should set the thought message to the passed in string', () => {
      component.updateTaskMessage(fakeEvent, fakeText);
      expect(component.task.message).toEqual(fakeText);
    });

    it(`should prevent the default event`, () => {
      component.updateTaskMessage(fakeEvent, fakeText);
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('toggleDeleteConfirmation', () => {
    it('should set the deletion flag to true if it was false before', () => {
      component.deleteWasToggled = false;
      component.toggleDeleteConfirmation();
      expect(component.deleteWasToggled).toBeTruthy();
    });
  });

  describe('toggleDeleteConfirmation', () => {
    it('should set the deletion flag to false if it was true before', () => {
      component.deleteWasToggled = true;
      component.toggleDeleteConfirmation();
      expect(component.deleteWasToggled).toBeFalsy();
    });
  });
});
