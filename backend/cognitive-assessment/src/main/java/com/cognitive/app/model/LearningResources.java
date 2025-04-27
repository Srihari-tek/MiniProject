package com.cognitive.app.model;

public class LearningResources{
    private String type; private String title; private String url;
    public LearningResources(String type, String title, String url) {
        this.type = type;
        this.title = title;
        this.url = url;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setUrl(String url) {
        this.url = url;
    }

}
