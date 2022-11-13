import { Component, OnInit } from '@angular/core';
import { TempService } from 'src/app/_services/temp.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  temp: any;
  tempObservarable: any;

  page = "false";
  id: any;

  constructor(
    private tempService: TempService
  ) { 

    this.tempObservarable = this.tempService.getDataObservable();
    this.tempObservarable.subscribe(arg => {
      this.temp = arg.temp;
    });

    this.tempService.setPage('settings');
    
  }

  ngOnInit(): void {
  }

}
