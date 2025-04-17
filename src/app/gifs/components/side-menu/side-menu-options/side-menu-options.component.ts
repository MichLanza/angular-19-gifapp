import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuOption {
  label: string;
  sublabel: string;
  route: string;
  icon: string;

}



@Component({
  selector: 'gif-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.component.html',
  styleUrl: './side-menu-options.component.css'
})
export class SideMenuOptionsComponent {


  menuOption: MenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      sublabel: 'Gifs Populares',
      route: '/dashboard/trending',
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Buscador',
      sublabel: 'Buscador de Gifs',
      route: '/dashboard/search',
    },
  ]


}
