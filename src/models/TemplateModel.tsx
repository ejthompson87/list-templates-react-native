import { TemplateItemModel } from './TemplateItemModel';

export interface TemplateModel {
    id: string;
    title: string;
    items: Array<TemplateItemModel>;
}