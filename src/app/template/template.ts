import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgClass } from '../../../node_modules/@angular/common/types/_common_module-chunk';

@Component({
  selector: 'app-template',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './template.html',
  styleUrl: './template.scss',
})
export class Template {}
