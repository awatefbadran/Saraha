

export const create = async ({ model, data, options = {} }) => {
  const [document] = await model.create([data], options);
  return document;
};
export const findOne =async({model,filter,options={}={}})=>{
  return await model.findOne(filter,null,options)
}

export const findById =async({model,id,options={}={}})=>{
 return await model.create(id,options)
}
export const findByIdAndUpdate =async({model,id,update,options={}={}})=>{
  return await model.create(id,update,{new:true,runValidators:true , ...options})
}