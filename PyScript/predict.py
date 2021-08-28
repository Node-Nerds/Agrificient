import os
import joblib
import sys

import argparse


MODEL_DIR = "D:\Web\Agrificient\PyScript\models"


def loadModel(season, dir=MODEL_DIR):
    model = {
        "Rabi": os.path.join(dir, "lgb_Rabi.pkl"),
        "Kharif": os.path.join(dir, "lgb_kharif.pkl"),
        "Autumn": os.path.join(dir, "lgb_Autumn.pkl"),
        "Summer": os.path.join(dir, "lgb_Summer.pkl"),
        "Winter": os.path.join(dir, "lgb_Winter.pkl"),
        "Annual": os.path.join(dir, "lgb_Year.pkl"),
    }

    return joblib.load(model.get(season))


def preEncodeFeatures(crop, district, dir=MODEL_DIR):
    le_crop = joblib.load(os.path.join(dir, "le_crop.pkl"))
    le_district = joblib.load(os.path.join(dir, "le_district.pkl"))

    return le_crop.transform([crop]), le_district.transform([district])


def main():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument("--year", help="Year to predict", type=int)
    parser.add_argument("--season", help="Type the season", default="Rabi")
    parser.add_argument(
        "--district",
        help="Name of District",
    )
    parser.add_argument("--crop", help="Name of Crop")
    args = parser.parse_args()

    year = args.year
    season = args.season
    district = args.district
    crop = args.crop

    model = loadModel(season=season)
    crop, district = preEncodeFeatures(crop=crop, district=district)

    data = [district, year, crop]
    prediction = model.predict([data])

    print(prediction)
    return prediction


if __name__ == "__main__":
    main()
