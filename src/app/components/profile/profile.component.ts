import { Component, OnInit, Input } from '@angular/core';
import { Client } from '../clients/Client';
import { ClientService } from 'src/app/providers/client.service';
import { ModalService } from '../../providers/modal.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'client-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  title: string = 'Perfil';
  @Input() client: Client;
  selectedImage: File;
  progress: number = 0;

  constructor(private clientService: ClientService,
    public modalService: ModalService) { }

  ngOnInit(): void {
  }

  selectImage(event) {
    this.selectedImage = event.target.files[0];
    this.progress = 0;
    console.log(this.selectedImage);
    if(this.selectedImage.type.indexOf('image') < 0) {
      Swal.fire(
        'Error',
        'El archivo debe ser una imagen',
        'error'
      );
      this.selectedImage = null;
    }
  }

  uploadImage() {
    if(!this.selectedImage) {
      Swal.fire(
        'Error',
        'Debe seleccionar una imagen',
        'error'
      )
    } else {
      this.clientService.uploadImage(this.selectedImage, this.client.id).subscribe(
        res => {
          if(res.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((res.loaded / res.total) * 100)
          } else if(res.type === HttpEventType.Response) {
            let response: any = res.body;
            this.client = response.client as Client;
            this.modalService.notifyUpload.emit(this.client);
            Swal.fire(
              'Imagen subida',
              `La imagen ${this.client.image} subida con éxito`,
              'success'
            )
          }
        }
      );
    }
  }

  closeModal() {
    this.modalService.hiddenModal();
    this.selectedImage = null;
    this.progress = 0;
  }

}
