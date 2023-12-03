'use client'

import { FormEventHandler, ChangeEvent, useState, useEffect } from "react"
import { z } from "zod";
import Field from "./Field";
import api from "@/api";
import { AdInfo, Category } from "@/types";
import { imageValidation } from "@/helpers/ValidatorHandler";
import { UpdateAdInfoParams } from "@/types/apiTypes";

interface ProfileModalProps {
  openModal: (params: boolean) => void;
  id: string;
}

type ErrorFieldOptions = '' | 'title' | 'description' | 'category' | 'state' | 'price' | 'priceNeg' | 'images';

interface FormDataType extends Omit<UpdateAdInfoParams, 'id'> {};

export const ProfileAdModal = ({ openModal, id }: ProfileModalProps) => {
  const [fullAdInfo, setFullAdInfo] = useState<AdInfo | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [priceNeg, setPriceNeg] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState('');

  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const [errorField, setErrorField] = useState<ErrorFieldOptions>('');
  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(false);
  
  let controller: AbortController;

  useEffect(() => {
    controller = new AbortController();
    const signal = controller.signal;
    const fethData = async () => {
      const [adInfo, categories] = await Promise.all([api.getAdInfo(id, false, signal), api.getCategories(signal)]);
      setCategoryList(categories);
      if (!adInfo) {
        return;
      }
      setFullAdInfo(adInfo);
      setTitle(adInfo.title);
      setCategory(adInfo.category._id);
      setPrice(adInfo.price.toString());
      setPriceNeg(adInfo.priceNegotiable);
      setDescription(adInfo.description);
    }
    fethData();

    return () => {
      controller.abort();
    }
  }, []);

  const AdInfo = z.object({
    title: z.string().nonempty('Este campo não pode estar vazio').min(3,'O titulo precisa ter pelo menos 3 caracteres'),
    category: z.string().nonempty('Este campo não pode estar vazio'),
    price: z.number(),
    priceNegotiable: z.boolean(),
    description: z.string().nonempty('Este campo não pode estar vazio').min(10, 'A descrição precisa ter pelo menos 10 caracteres')
  });

  const clearErros = () => {
    setErrorField('');
    setErrorMessage('');
  }

  const getNoRepeatedFields = (formData: FormDataType) => {
    let data: FormDataType = {};
    if (title !== fullAdInfo?.title) {
      data.title = formData.title;
    }
    if (category !== fullAdInfo?.category._id) {
      data.category = formData.category;
    }
    if (parseFloat(price) !== fullAdInfo?.price) {
      data.price = formData.price;
    }
    if (priceNeg !== fullAdInfo?.priceNegotiable) {
      data.priceNegotiable = formData.priceNegotiable;
    }
    if (formData.img) {
      data.img = formData.img;
    }
    return data;
  }

  const handleUpdateAd: FormEventHandler = async (e) => {
    e.preventDefault();
    clearErros();

    let formData: FormDataType = {};

    if (title) formData.title = title;
    if (category) formData.category = category;
    if (price) {
      formData.price = parseFloat(price);
      if (priceNeg) formData.price = 0;
    };
    if (typeof priceNeg == 'boolean') formData.priceNegotiable = priceNeg;
    formData.description = description ? description : '';

    const result = AdInfo.safeParse(formData);

    if (!result.success) {
      const data: { message: string, path: string[] } = JSON.parse(result.error.message)[0];
      const errorPath = data.path[0];
      setErrorField(errorPath as ErrorFieldOptions);
      setErrorMessage(data.message);
      return;
    }

    if (images) {
      const { errorMessage, path } = imageValidation(images);
      if (errorMessage) {
        setErrorField(path);
        setErrorMessage(errorMessage);
        return;
      }
      formData.img = images
    };

    setLoading(true);
    const fieldsToUpdate = getNoRepeatedFields(formData);
    const response = await api.updateAdInfo({id, ...fieldsToUpdate});
    setLoading(false);

    if ('error' in response) {
      const errorPath = Object.keys(response.error)[0];
      setErrorField(errorPath as ErrorFieldOptions);
      setErrorMessage(response.error[errorPath].msg);
      return;
    }
    openModal(false);
    window.location.reload();
  }

  const verifyAlert = (fieldName: ErrorFieldOptions) => {
    return errorField === fieldName;
  };

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (verifyAlert('images')) clearErros();
    if (files && files.length > 0) setImages(Array.from(files));
  }

  const handleDescChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (verifyAlert('description')) {
      clearErros();
    }
    setDescription(e.target.value);
  }

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-70 flex justify-center items-center" >
      <div className="bg-white p-5 w-auto h-auto rounded-lg min-w-[800px]">
        <form method="POST" encType="multipart/form-data" className="w-full" onSubmit={handleUpdateAd}>
          <Field.FieldRoot>
            <Field.Label title="Titulo:" />
            <Field.ErrorMessage message={errorField == 'title' ? errorMessage : ''} >
              <Field.Input 
                name="title" 
                required={true} 
                value={title} 
                setValue={setTitle} 
                alert={verifyAlert('title')} 
                clearErros={clearErros} 
              />
            </Field.ErrorMessage>
          </Field.FieldRoot>

          <Field.FieldRoot>
            <Field.Label title="Categoria:" />
            <Field.ErrorMessage message={errorField == 'category' ? errorMessage : ''}>
              <Field.Select 
                name="category" 
                value={category} 
                setValue={setCategory} 
                data={categoryList} 
                alert={verifyAlert('category')} 
                clearErros={clearErros} 
              />
            </Field.ErrorMessage>
          </Field.FieldRoot>

          <Field.FieldRoot>
            <Field.Label title="Preço:" />
            <Field.ErrorMessage message={errorField == 'price' ? errorMessage : ''}>
              <Field.Input 
                type="number" 
                name="price" 
                required={true} 
                value={price} 
                setValue={setPrice} 
                alert={verifyAlert('price')} 
                clearErros={clearErros} 
              />
            </Field.ErrorMessage>
          </Field.FieldRoot>

          <Field.FieldRoot>
            <Field.Label title="Preço negociável:" htmlFor="priceNeg"/>
            <input 
              type="checkbox" 
              name="priceNeg" 
              id="priceNeg" 
              checked={priceNeg} 
              onChange={e => setPriceNeg(e.target.checked)} 
              className="cursor-pointer" 
            />
          </Field.FieldRoot>

          <Field.FieldRoot>
            <Field.Label title="Imagens:" />
            <Field.ErrorMessage message={errorField == 'images' ? errorMessage : ''}>
              <Field.IFile 
                type="file" 
                name="file" 
                multiple 
                maxLength={4}
                accept="image/png, image/jpg, image/jpeg"
                alert={verifyAlert('images')} 
                onChange={handleImages}
              />
            </Field.ErrorMessage>
          </Field.FieldRoot>

          <Field.FieldRoot>
            <Field.Label title="Descrição:" />
            <Field.ErrorMessage message={errorField == 'description' ? errorMessage : ''}>
              <textarea 
                name="description" 
                id="description"
                value={description}
                onChange={handleDescChange}
                minLength={10}
                maxLength={100}
                className={`flex-1 w-full h-28 p-1 border-[1px] border-gray-300 rounded outline-1 outline-gray-400 resize-none ${verifyAlert('description') ? 'border-red-500' : ''}`} 
              ></textarea>
            </Field.ErrorMessage>
          </Field.FieldRoot>

          <div className="flex gap-4">
            <Field.FieldRoot>
              <Field.Label title="" />
              <Field.Button
                type="submit"
                title='Cancelar alterações'
                onClick={() => openModal(false)}
              />
            </Field.FieldRoot>
            <Field.FieldRoot>
              <Field.Button
                type="submit"
                color="green"
                title={loading ? 'Salvando...' : 'Salvar alterações'}
              />
            </Field.FieldRoot>
          </div>
        </form>
      </div>
    </div>
  )
}