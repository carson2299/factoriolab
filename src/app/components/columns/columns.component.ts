import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs';

import {
  ColumnKey,
  ColumnSettings,
  columnsInfo,
  ColumnsState,
  DialogComponent,
  Entities,
  initialColumnsState,
} from '~/models';
import { ContentService } from '~/services';
import { LabState, Preferences, Settings } from '~/store';

@Component({
  selector: 'lab-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnsComponent extends DialogComponent implements OnInit {
  store = inject(Store<LabState>);
  contentSvc = inject(ContentService);

  columnOptions = this.store.selectSignal(Settings.getColumnOptions);

  editValue: Entities<ColumnSettings> = initialColumnsState;
  columnsInf = columnsInfo;

  get modified(): boolean {
    return (Object.keys(this.editValue) as ColumnKey[]).some(
      (k) =>
        this.editValue[k].precision !==
          Preferences.initialPreferencesState.columns[k].precision ||
        this.editValue[k].show !==
          Preferences.initialPreferencesState.columns[k].show,
    );
  }

  show$ = this.contentSvc.showColumns$.pipe(
    takeUntilDestroyed(),
    withLatestFrom(this.store.select(Settings.getColumnsState)),
    tap(([_, c]) => {
      this.initEdit(c);
      this.show();
    }),
  );

  ngOnInit(): void {
    this.show$.subscribe();
  }

  initEdit(columns: ColumnsState): void {
    this.editValue = (Object.keys(columns) as ColumnKey[])
      .filter((c) => columnsInfo[c] != null) // Filter out any obsolete keys
      .reduce((e: Entities<ColumnSettings>, c) => {
        e[c] = { ...columns[c] };
        return e;
      }, {});
  }

  changeFraction(value: boolean, column: ColumnKey): void {
    this.editValue[column].precision = value ? null : 1;
  }

  reset(): void {
    this.initEdit(Preferences.initialPreferencesState.columns);
  }

  save(): void {
    this.store.dispatch(
      new Preferences.SetColumnsAction(this.editValue as ColumnsState),
    );
  }
}
