import { LightningElement,track,wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { createRecord} from 'lightning/uiRecordApi';
import { ShowToastEvent} from 'lightning/platformShowToastEvent';
import PROJECT_OBJECT from '@salesforce/schema/Project__c';
import STATUS_FIELD from '@salesforce/schema/Project__c.Status__c';
import PROJECT_TYPE from '@salesforce/schema/Project__c.Project_Type__c';
import PRIORITY_FIELD from '@salesforce/schema/Project__c.Priority__c';
import Project_Name from '@salesforce/schema/Project__c.Name';
import User from '@salesforce/schema/Project__c.User__c';
import Description from '@salesforce/schema/Project__c.Description__c';
import End_Date from '@salesforce/schema/Project__c.End_Date__c';

export default class NewProjectPopup extends LightningElement {
  desc 
  name 
  owner 
  enddate
   statusValues;
   projectTypeValues;
     priorityTypeValues;

  //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded
  @track isModalOpen = false;
  openModal() {
    // to open modal set isModalOpen tarck value as true
    this.isModalOpen = true;
  }
  closeModal() {
    // to close modal set isModalOpen tarck value as false
    this.isModalOpen = false;
  }
  submitDetails() {
    this.isModalOpen = false;
  }

  @wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA',
    fieldApiName: STATUS_FIELD
   }) status;

@wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA', 
   fieldApiName: PRIORITY_FIELD
}) priority;

@wire(getPicklistValues, {
   recordTypeId: '012000000000000AAA', 
  fieldApiName: PROJECT_TYPE
}) project;

  formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "indent",
    "align",
    "link",
    "image",
    "clean",
    "table",
    "header",
    "emoji"
  ];
  myval(event) {
    this.desc = event.target.value;
  }
  nameProject(event) {
    this.name = event.target.value;
  }
  
  ownerName(event){
    this.owner=event.target.value;
}
handleEnddate(event){
this.Enddate=event.target.value;
}

    handleChangeStatus(event){
        this.statusValues =event.target.value;
  }
    handlechangeProject(event){
        this.projectTypeValues=event.target.value;
  }
    handlechangePriority(event){
        this.priorityTypeValues=event.target.value;
  }

      

    createProject(){

            const fields={};
            fields[Project_Name.fieldApiName]=this.name;
            fields[PROJECT_TYPE.fieldApiName]=this.projectTypeValues;
            fields[STATUS_FIELDApiName]= this.statusValues;
            fields[PRIORITY_FIELDApiName]=this.priorityTypeValues;
            fields[User.fieldApiName]=this.owner;
            fields[End_Date.fieldApiName]=this.Enddate;
            fields[Description.fieldApiName]=this.desc;

            const recordinputs={ApiName: PROJECT_OBJECT.objectApiNmae,fields};
            createRecord(recordinputs).then(result =>{
              this.dispatchEvent(
                new ShowToastEvent({
                  title: "Success!!",
                  message: "project Created Successfully!!",
                  variant: "success"
                }),);
                this.handleReset();
                if(this.check){ 
                  // pop closes when record saved.
                 // location.reload(true);
                
                  this.isModalOpen=false
                  }
            }).catch((error) => {
              this.dispatchEvent(
                new ShowToastEvent({
                  title: "Error creating record",
                  message: error.body.message,
                  variant: "error"
                })
              );
            });


    

    }
    saveClick() {
      if (this.checkError()) {
        this.check = true;
        this.createProject();
      }
    }
  
    // saves record and keeps the popup open on clicking save and new
    saveAndNewClick() {
      if (this.checkError() ) {
        this.check = false;
        this.createProject();
      }
  
    }
    checkError() {
      var valid = true;
      var inputs = this.template.querySelectorAll(".requiredfield");
      inputs.forEach((input) => {
        if (!input.checkValidity()) {
          input.reportValidity();
          valid = false;
        }
      });
      return valid;
    }

    handleReset(event)
   {
    const inputfields=this.template.querySelectorAll('.resetfields');
    if(inputfields)
    {
      inputfields.forEach(field=>{
        field.value='';
      });
      this.name=null;
      this.projectTypeValues =null;
      this.Enddate=null;
      this.statusValues=null;
      this.priorityTypeValues=null;
      this.owner=null;
      this.desc='';    
    } 
   }
}