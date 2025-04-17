import { Component } from '@angular/core';
import { SideMenuOptionsComponent } from "./side-menu-options/side-menu-options.component";
import { SideMenuHeaderComponent } from "./side-menu-header/side-menu-header.component";

@Component({
  selector: 'gif-side-menu',
  imports: [SideMenuOptionsComponent, SideMenuHeaderComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {

}
