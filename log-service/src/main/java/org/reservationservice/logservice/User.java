package org.reservationservice.logservice;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String login;

    @NotBlank
    private String password;

    @NotNull
    private Boolean privileges;

    public User(){
    }

    public User(String login, String password, Boolean privileges){
        this.login = login;
        this.password = password;
        this.privileges = privileges;
    }

    public Long getId(){
        return this.id;
    }
    public String getLogin(){
        return this.login;
    }
    public void setLogin(String newLogin){
        this.login = newLogin;
    }

    public String getPassword(){
        return this.password;
    }
    public void setPassword(String newPassword){
        this.password = newPassword;
    }

    public Boolean getPrivileges(){
        return this.privileges;
    }
    public void setPrivileges(Boolean newPrivileges){
        this.privileges = newPrivileges;
    }
}
