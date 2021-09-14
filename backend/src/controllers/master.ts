import { mailer } from './mailer';
const fetch = require("node-fetch");
import mongoose from "mongoose";
import { RequestHandler } from "express";
import masterModel, { Master } from "../db/models/master.model";
import LocationModel, { Location } from "../db/models/location.model";
import categoryModel from "../db/models/category.model";

export const createMaster: RequestHandler = async (req, res) => {
  // console.log('Зашли в ручку createMaster');
  
  try {
    const {
      name, login, email,
      password, category,
      experience,
      description,
      city,
      street,
      phoneNumber, } = req.body as {
        email: string;
        name: string;
        password: string;
        login: string;
        experience: string;
        category: string;
        description: string;
        city: string;
        street: string;
        phoneNumber: string;
      };
    const checkExistingEmail = await masterModel.findOne({ email });
    if (!checkExistingEmail) {
      const checkExistingName = await masterModel.findOne({ login });
      if (!checkExistingName) {
        const chooseCategory = await categoryModel.findOne({ category });
        // console.log(chooseCategory);

        const api = "0f8e2dd1-121c-4be5-aeac-8ed33dc30430";
        const URI = `https://geocode-maps.yandex.ru/1.x/?apikey=${api}&format=json&geocode=${street},+${city},+Netherlands`;
        const encodedURI = await encodeURI(URI);
        const response = await fetch(encodedURI);
        const result = await response.json();
        const coordinates = result.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
          .split(" ")
          .map((el: string) => Number(el));
          // console.log(coordinates);
          
        if (coordinates) {
          const location = await LocationModel.create({ coordinates, street, city });
          const newMaster = await new masterModel({
            email, name, password,
            login, experience,
            location,
            category: chooseCategory,
            description,
            phoneNumber,
          });
          await newMaster.save();
          // console.log('newMaster создан');
          const message = {
            to: email,
            subject: 'Вы успешно зарегистрировались.',
            html: `
                <h2>Поздравляем с успешной регистрацией!</h2>
                <div>Данные вашей учетной записи:</div>
                <ul>
                <li>Логин: ${login},</li>
                <li>Пароль: ${password}.</li>
                </ul>
                Желаем успешных заказов!`
          };
          mailer(message);
          if (newMaster) {
            req.session.user = {
              name: newMaster.name,
              id: newMaster.id
            };
            return res.status(200).json({
              name: req.session.user.name,
              masterId: req.session.user.id,
              role: 'master'
            });
          } else {
            return res.status(500).json({ message: "Something went wrong" });
          }
        } else {
          return res.status(500).json({ message: "Coordinate undefined" });
        }
      }
      return res.status(500).json({ message: "This nick already exists" });
    }
    return res.status(500).json({ message: "This email already exists" });
  } catch (error) {
    console.log(error);
  }
};

export const loginMaster: RequestHandler = async (req, res, next) => {
  try {
    const { login, password } = req.body as {
      login: string;
      password: string;
    };
    const checkMaster = await masterModel.findOne({ login });
    if (checkMaster) {
      if (checkMaster.password === password) {
        req.session.user = {
          name: checkMaster.name,
          id: checkMaster.id
        };
        return res.status(200).json({
          name: req.session.user.name,
          masterId: req.session.user.id,
          role: 'master'
        });
      }
    }
    return res
      .status(500)
      .json({ success: false, message: "Wrong email or password" });
  } catch (error) {
    console.log(error);
  }
};

export const getAllMasters: RequestHandler = async (req, res) => {
  try {
    const masters = await masterModel.find();
    res.status(200).json({ masters });
  } catch (error) {
    console.log(error);
  }
};

export const getAccountMaster: RequestHandler = async (req, res) => {
  try {
    const masterAccount = await masterModel.findOne({ _id: req?.session?.user?.id });
    res.status(200).json({ masterAccount });
  } catch (error) {
    console.log(error);
  }
};

export const editMasterProfile: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log('Зашли в ручку editMasterProfile');
    const {
      name, login, email, category, experience, description, city, street, phoneNumber } = req.body as {
        name: string,
        login: string,
        phoneNumber: string,
        email: string,
        description: string,
        category: string,
        experience: string,
        city: string,
        street: string,
      };
    const newCategory = await categoryModel.findOne({ category });
    //@ts-ignore
    const uptdaterMaster = await masterModel.findByIdAndUpdate({ _id: req?.session?.user?.id }, {
      name, login,
      email,
      experience, description,
      city, street, phoneNumber,
      category: newCategory,
    }, { new: true })
    return res.status(200).json({
      uptdaterMaster
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAuthorReviews: RequestHandler = async (req, res) => {
  try {
    console.log('Зашли в ручку getAuthorReviews');
    const master = await masterModel.findById(req?.session?.user?.id);
    console.log(master);
    
    res.status(200).json({ master });
  } catch (error) {
    console.log(error);
  }
};
