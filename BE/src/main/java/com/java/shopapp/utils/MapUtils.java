package com.java.shopapp.utils;

public class MapUtils {
    public static <T> T getObject(Object item, Class<T> tClass){
        if(item != null){
            if(tClass.getTypeName().equals("java.lang.Long")){
                item = item != "" ? Long.parseLong(item.toString()) : null;
            }
            else if(tClass.getTypeName().equals("java.lang.Double")){
                item = item != "" ? Double.parseDouble(item.toString()) : null;
            }
            else if(tClass.getTypeName().equals("java.lang.Integer")){
                item = item != "" ? Integer.parseInt(item.toString()) : null;
            }
            else if(tClass.getTypeName().equals("java.lang.String")){
                item = item.toString();
            }
            return tClass.cast(item);
        }
        return null;
    }
}
