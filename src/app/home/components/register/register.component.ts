import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../services/register.service';
import { usuario } from '../interfaces/usuario';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private register: RegisterService) {}
  lista_register: usuario[] = [];
  async ngOnInit() {
    await this.update_data();
  }
  async update_data() {
    this.lista_register = await this.register.loadGrid();
  }
}
