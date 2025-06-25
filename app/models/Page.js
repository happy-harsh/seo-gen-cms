import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const PageSchema = new Schema({
    title: String,
    content: String,
    category: String,
    meta_title: String,
    meta_description: String,
    keywords: [String],
  });

const Pages = models.Pages || model('Pages', PageSchema);
export default Pages;
