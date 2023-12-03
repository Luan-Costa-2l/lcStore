'use client'

import { useState, FormEventHandler, useEffect, ChangeEvent } from "react";
import { z } from "zod";
import api from "@/api";
import { Category } from "@/types";
import Field from "@/components/Field";
import { CreateNewAdParams } from "@/types/apiTypes";
import { imageValidation } from "@/helpers/ValidatorHandler";

type ErrorFieldOptions = '' | 'title' | 'category' | 'price' | 'priceNegotiable' | 'description' | 'password' | 'images';


export const AddAdForm = () => {
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
    const fetchCategories = async () => {
      const response = await api.getCategories(signal);
      setCategoryList(response ? response : []);
    }
    fetchCategories();
    return () => {
      controller.abort();
    }
  }, []);

  const UserInfo = z.object({
    title: z.string().nonempty('Este campo não pode estar vazio').min(2, 'Nome precisa ter pelo menos 2 caracters'),
    category: z.string().nonempty('Este campo não pode estar vazio'),
    price: z.string().nonempty('Este campo não pode estar vazio'),
    priceNeg: z.boolean(),
    description: z.string().nonempty('Este campo não pode estar vazio').min(10, 'Descrição precisa ter mais de 10 caracteres').max(100, 'Descrição não pode ter mais de 100 caracteres'),
  });

  const clearErros = () => {
    setErrorField('');
    setErrorMessage('');
  }

  const handleCreateNewAd: FormEventHandler = async (e) => {
    e.preventDefault();
    clearErros();

    let adData: { title: string, category: string, price: string, priceNeg: boolean, description: string, img?: File[] } = {
      title,
      category,
      price,
      priceNeg,
      description
    };

    const result = UserInfo.safeParse(adData);
    if (!result.success) {
      const data: { message: string, path: string[] } = JSON.parse(result.error.message)[0];
      const errorPath = data.path[0];
      setErrorField(errorPath as ErrorFieldOptions);
      setErrorMessage(data.message);
      return;
    }

    let formData: CreateNewAdParams = {
      title,
      category,
      price: (!parseFloat(price) || priceNeg) ? 0 : parseFloat(price),
      priceNegotiable: priceNeg,
      description,
      img: []
    }

    if (images.length === 0) {
      setErrorField('images');
      setErrorMessage('Adicione pelo menos uma imagem');
      return;
    }

    const { errorMessage, path } = imageValidation(images);
    if (errorMessage) {
      setErrorField(path);
      setErrorMessage(errorMessage);
      return;
    }
    formData.img = images;


    setLoading(true);
    const response = await api.createNewAd(formData);
    setLoading(false);

    if ('error' in response) {
      const errorPath = Object.keys(response.error)[0];
      setErrorField(errorPath as ErrorFieldOptions);
      setErrorMessage(response.error[errorPath].msg);
      return;
    }

    window.location.href = `/ads/${response.id}`;
  }

  const verifyAlert = (fieldName: ErrorFieldOptions): boolean => {
    return fieldName === errorField;
  }

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
    <form method="POST" className="w-full" onSubmit={handleCreateNewAd}>
      <Field.FieldRoot>
        <Field.Label title="Titulo:" />
        <Field.ErrorMessage message={errorField == 'title' ? errorMessage : ''} >
          <Field.Input name="tile" required={true} value={title} setValue={setTitle} alert={verifyAlert('title')} clearErros={clearErros} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Categoria:" />
        <Field.ErrorMessage message={errorField == 'category' ? errorMessage : ''}>
          <Field.Select name="category" value={category} setValue={setCategory} data={categoryList} alert={verifyAlert('category')} clearErros={clearErros} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Preço:" />
        <Field.ErrorMessage message={errorField == 'price' ? errorMessage : ''}>
          <Field.Input type="number" name="price" required={true} value={price} setValue={setPrice} alert={verifyAlert('price')} clearErros={clearErros} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Preço negociável:" htmlFor="priceNeg" />
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

      <Field.FieldRoot>
        <Field.Label title="" />
        <Field.Button type="submit" title={loading ? 'Salvando...' : 'Salvar alterações'} />
      </Field.FieldRoot>
    </form>
  )
}
